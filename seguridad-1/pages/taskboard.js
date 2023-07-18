import Head from "next/head";
import Image from "next/image";
import { withSessionSsr } from "../lib/session";
import Button from "@mui/material/Button";

import Navbar from "../components/Navbar";
import Container from "../components/Container";
import taskdata from "./taskdata";
import { useEffect, useState } from "react";
import { userServiceFactory } from "../clientServices/userService";

const userService = userServiceFactory();

export default function Taskboard({ user, admin }) {
	const [DBtasks, setDBtasks] = useState("");
	let set = false;

	async function markDone(task_id) {
		const response = await userService.markTaskDone(task_id);
	}

	useEffect(() => {
		async function getDBTasks() {
			const response = await userService.getTasks(user);
			setDBtasks(response.data.userTasks);
			set = true;
		}

		if (!set) {
			getDBTasks();
		}
	}, []);

	let incompelte = [];
	let complete = [];

	for (let i = 0; i < DBtasks.length; i++) {
		if (DBtasks[i].completed) {
			complete.push(DBtasks[i]);
		} else {
			incompelte.push(DBtasks[i]);
		}
	}

	let newtasks = [...DBtasks];
	const toggleTask = (id) => {
		const task = newtasks.find((t) => t.id === id);
		task.completed = !task.completed;
	};

	const completeTasks = () => {
		const completed_tasks = newtasks.filter((t) => t.completed === true);
		setDBtasks(newtasks);
		for (var i = 0; i < completed_tasks.length; ++i) {
			markDone(completed_tasks[i].id);
		}
	};

	return (
		<div>
			<Navbar />
			<div className="app-cont">
				<Container
					title="Tareas por hacer"
					tasks={incompelte}
					toggleTask={toggleTask}
					completeTasks={completeTasks}
				/>
				<div className="separator"></div>
				<Container title="Tareas completadas" tasks={complete} />
			</div>
		</div>
	);
}

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req, res }) {
		const user = req.session.email;

		if (user === undefined) {
			console.log("no user");
			res.setHeader("location", "/login");
			res.statusCode = 302;
			res.end();
			return { props: {} };
		}

		return {
			props: { user: req.session.email, admin: req.session.isAdmin },
		};
	}
);
