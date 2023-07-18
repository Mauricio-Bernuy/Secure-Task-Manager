import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { withSessionSsr } from "../lib/session";
import Button from "@mui/material/Button";
import Navbar from "../components/Navbar";

import { userServiceFactory } from "../clientServices/userService";
import useUser from "../lib/useUser";

const userService = userServiceFactory();

import postWorkingStatus from "./api.client/postWorkingStatus";
import postCheckin from "./api.client/postCheckin";
import postCheckout from "./api.client/postCheckout";

// postCheckout
export default function Home({ user, admin }) {
	const [working, setWorking] = useState(false);
	useEffect(() => {
		(async () => {
			try {
				const response = await postWorkingStatus({ email: user });
				setWorking(response.data.working);
			} catch (e) {
				console.log("e", e);
				setWorking(true);
			}
		})();
	}, []);
	const handleCheckout = async () => {
		(async () => {
			try {
				const response = await postCheckout({ email: user });
				alert(response.data);
				setWorking(false);
				// setWorking(!response.data.working)
			} catch (e) {
				console.log("e", e);
				setWorking(true);
			}
		})();
	};
	const handleCheckIn = async () => {
		try {
			const body = { email: user };
			const response = await postCheckin(body);
			setWorking(true);
			alert(response.data);
		} catch (e) {
			console.log(e);
			alert("Error checking in");
		}
	};

	const [first_name, setFname] = useState("");
	const [last_name, setLname] = useState("");
	const [_email, set_Email] = useState("");
	const [_password, set_Password] = useState("");
	const [is_admin, set_Is_Admin] = useState("");
	const [mock_email, set_MockEmail] = useState("");

	const handleMock = async (e) => {
		e.preventDefault();

		const mock = await userService.mockTask(mock_email);
		console.log(mock);
	};
	const handleEnroll = async (e) => {
		e.preventDefault();
		try {
			const newuser = await userService.register(
				first_name,
				last_name,
				_email,
				_password,
				Boolean(Number(is_admin))
			);
			console.log("user", newuser);
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	const fnameHandler = (e) => {
		setFname(e.target.value);
	};
	const lnameHandler = (e) => {
		setLname(e.target.value);
	};
	const _emailHandler = (e) => {
		set_Email(e.target.value);
	};
	const _passwordHandler = (e) => {
		set_Password(e.target.value);
	};
	const adminHandler = (e) => {
		set_Is_Admin(e.target.value);
	};
	const mock_emailHandler = (e) => {
		set_MockEmail(e.target.value);
	};

	return (
		<div>
			<Navbar />
			<div className="centered">
				<Head>
					<title>Home</title>
				</Head>
				<div className="stackv">
					<h2>Welcome to the home page, {user}!</h2>
{/* 
					{working ? (
						<Button variant="contained" onClick={handleCheckout}>
							Check Out!
						</Button>
					) : (
						<Button variant="contained" onClick={handleCheckIn}>
							Check In!
						</Button>
					)} */}

					<hr></hr>
					<a href="/taskboard"> - Go to my tasks - </a>

					{!admin ? (
						<h1>no admin rights 😢</h1>
					) : (
						<>
							<h1>ADMIN RIGHTS ✅</h1>

							<form onSubmit={handleEnroll}>
								<div className="stackv">
									<hr></hr>

									<h1>REGISTER NEW USER</h1>

									<div className="container">
										<label htmlFor="fname">
											<b> First Name </b>
										</label>
										<input
											type="text"
											placeholder="Enter fname"
											name="fname"
											required
											onChange={fnameHandler}
										/>
										<label htmlFor="lname">
											<b> Last Name </b>
										</label>
										<input
											type="text"
											placeholder="Enter lname"
											name="lname"
											required
											onChange={lnameHandler}
										/>
										<label htmlFor="_email">
											<b> Email </b>
										</label>
										<input
											type="email"
											placeholder="Enter Email"
											name="email"
											required
											onChange={_emailHandler}
										/>

										<label htmlFor="_password">
											<b> Password </b>
										</label>
										<input
											type="password"
											placeholder="Enter Password"
											name="_password"
											required
											onChange={_passwordHandler}
										/>

										<label htmlFor="admin">
											<b> Is admin </b>
										</label>
										<input
											type="number"
											name="admin"
											required
											defaultValue="0"
											min="0"
											max="1"
											onChange={adminHandler}
										/>
										<button type="submit">
											Enroll User
										</button>
									</div>
								</div>
							</form>

							<form onSubmit={handleMock}>
								<div className="stackv">
									<hr></hr>

									<h1>GENERATE MOCK TASK</h1>
									<label htmlFor="mock_email">
										<b> Email </b>
									</label>
									<input
										type="email"
										placeholder="Enter Email"
										name="mock_email"
										required
										onChange={mock_emailHandler}
									/>
									<button type="submit">Generate Mock</button>
								</div>
							</form>
						</>
					)}
				</div>
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
