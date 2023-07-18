import {AttendanceEvents} from './helpers/attendanceEvents.js';

const knex = require("knex")({
	client: "pg",
	connection: {
		host: process.env.PGSQL_HOST,
		port: process.env.PGSQL_PORT,
		user: process.env.PGSQL_USER,
		password: process.env.PGSQL_PASSWORD,
		database: process.env.PGSQL_DATABASE,
	},
});


const databaseServiceFactory = () => {
	const USERS_TABLE = "users";
	const _2FA_TABLE = "_2fa";
	const TASKS_TABLE = "tasks";
	const STORIES_TABLE = "stories";
	const EPICS_TABLE = "epics";
	const PROJECTS_TABLE = "projects";
	const USER_PROJECTS_TABLE = "users_projects_table";
	const ATTENDANCE_TABLE = "attendance";

	//* USERS */ 

	const getUser = async (email) => {
		const user = await knex(USERS_TABLE).select().where("email", email);
		if (user.length === 0) {
			throw new Error("User not found");
		}
		return user[0];
	};

	// get all users, should need to auth as admin xd
	const getAllUsers = async () => {
		const user = await knex(USERS_TABLE).select();
		if (user.length === 0) {
			throw new Error("Users not found");
		}

		return user;
	};

	// add to table new register
	const enrollUser = async (
		first_name,
		last_name,
		email,
		password,
		is_admin
	) => {
		const newuser = await knex(USERS_TABLE).insert({
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
			is_admin: is_admin,
		});

		if (newuser.length === 0) {
			throw new Error("User not inserted");
		}

		return newuser;
	};

	//* 2FA */ 

	const append2FA = async (email,_2fa_code) => {
		const new_mail_code = await knex(_2FA_TABLE).insert({
			email:email,
			_2fa_code:_2fa_code,
		});
		if (new_mail_code.length === 0) {
			throw new Error("2FA not appended");
		}
		return new_mail_code[0];
	};

	const getLast2FA = async (email) => {
		const mail_code = await knex({s: _2FA_TABLE})
			.select('s.*')
			.join(
				knex(_2FA_TABLE).select(knex.raw('max(??) as ts', ['datetime'])).as('x'),
				'x.ts', 
				'=', 
				's.datetime'
			).where('s.email', email);
		
		if (mail_code.length === 0) {
			throw new Error("2FA not found");
		}
		return mail_code[0];
	};


	//* PROJECTS */ 

	const createProject = async (title, description) => {
		const newProject = await knex(PROJECTS_TABLE).insert({
			title: title,
			description: description,
		}).returning(['id']);

		return newProject;
	};

	const getProject = async (project_id) => {
		const project = await knex(PROJECTS_TABLE).select().where("id", project_id);
		if (project.length === 0) {
			throw new Error("Project not found");
		}
		return project[0];
	};

	const getUserProjects = async (email) => {
		const userdata = await getUser(email);
		console.log(userdata.id);
		const data = await knex.select("projects.id", "projects.title", "projects.description")
            .from(USERS_TABLE)
            .innerJoin(USER_PROJECTS_TABLE, 'users.id', USER_PROJECTS_TABLE + '.user_id')
            .innerJoin(PROJECTS_TABLE, 'projects.id', USER_PROJECTS_TABLE + '.project_id')
            .where('users.id', userdata.id)
		
		return data;
	};

	const addUserToProject = async (email, project_id) => {
		const userdata = await getUser(email);
		console.log(userdata.id);

		const userProject = await knex(USER_PROJECTS_TABLE).insert({
			user_id: userdata.id,
			project_id: project_id,
		}).returning(['user_id']);

		return userProject;
	};
	
	//* EPICS */ 

	const createEpic = async (title, description, project_id) => {
		const userdata = await getProject(project_id); // should throw if id is missing

		const newEpic = await knex(EPICS_TABLE).insert({
			title: title,
			description: description,
			project_id: project_id,
		}).returning(['id']);

		return newEpic;
	};

	const getEpic = async (epic_id) => {
		const epic = await knex(EPICS_TABLE).select().where("id", epic_id);
		if (epic.length === 0) {
			throw new Error("epic not found");
		}
		return epic[0];
	};
	
	const getProjectEpics = async (project_id) => {
		const data = await knex.select()
            .from(EPICS_TABLE)
            .where('project_id', project_id)
		
		return data;
	};

	//* STORIES */ 
	
	const createStory = async (title, description, epic_id) => {
		const epicdata = await getEpic(epic_id); // should throw if id is missing

		const newStory = await knex(STORIES_TABLE).insert({
			title: title,
			description: description,
			epic_id: epic_id,
		}).returning(['id']);

		return newStory;
	};
	
	const getStory = async (story_id) => {
		const story = await knex(STORIES_TABLE).select().where("id", story_id);
		if (story.length === 0) {
			throw new Error("Story not found");
		}
		return story[0];
	};
	
	const getEpicStories = async (epic_id) => {
		const data = await knex.select()
            .from(STORIES_TABLE)
            .where('epic_id', epic_id)
		
		return data;
	};

	//* TASKS */ 
	
	const createTask = async (
		email,
		title,
		description,
		start_date, // Now 
		end_date,
		story_id
	) => {
		const stage = "start"

		const userdata = await getUser(email);
		console.log(userdata.id);

		// if user isnt in project, add to project first
		
		const storydata = await getStory(story_id); // should throw if id is missing
		const epicdata = await getEpic(storydata.epic_id) // should throw if id is missing
		// const projectdata = await getProject(epicdata.project_id)
		const userInProject = await knex.select()
			.from(USERS_TABLE)
			.innerJoin(USER_PROJECTS_TABLE, 'users.id', USER_PROJECTS_TABLE + '.user_id')
			.innerJoin(PROJECTS_TABLE, 'projects.id', USER_PROJECTS_TABLE + '.project_id')
			.where('users.id', userdata.id)
			.where('projects.id', epicdata.project_id)
		if (userInProject.length === 0){
			throw new Error("User isn't part of the project. You may add them to the project in order to assign a task.")
		}

		// if start date now don't add it to table 
		const newtask = await knex(TASKS_TABLE).insert({
			title: title,
			description: description,
			user_id: userdata.id,
			start_date: start_date,
			end_date: end_date,
			stage: stage,
			story_id: story_id			
		}).returning(['id']);
		
		if (newtask.length === 0) {
			throw new Error("Can't create task");
		}

		return newtask;
	};

	const getTask = async (task_id) => {
		const task = await knex(TASKS_TABLE).select().where("id", task_id);
		if (task.length === 0) {
			throw new Error("Task not found");
		}
		return task[0];
	};

	const getStoryTasks = async (story_id) => {
		const data = await knex.select()
            .from(TASKS_TABLE)
            .where('story_id', story_id)
		
		return data;
	};

	const getUserTasks = async (email) => {
		const userdata = await getUser(email);
		console.log(userdata.id);

		const tasks = await knex(TASKS_TABLE)
			.select()
			.where("user_id", userdata.id);
		return tasks;
	};

	//* UPDATE TASKS */ 

	const updateScore = async (task_id, new_score) => {
		const updatedTask = await knex(TASKS_TABLE).update("score", new_score).where("id", task_id )
		if (updatedTask.length === 0) {
			throw new Error("Task not updated");
		}
		return updatedTask[0];
	}

	const updateComplete = async (task_id, complete = true) => {

		const updatedTask = await knex(TASKS_TABLE).update("completed", complete).where("id", task_id )
		if (updatedTask.length === 0) {
			throw new Error("Task not updated");
		}
		return updatedTask[0];
	}

	const updateStage = async (task_id, new_stage) => {

		const updatedStage = await knex(TASKS_TABLE).update("stage", new_stage).where("id", task_id )
		if (updatedTask.length === 0) {
			throw new Error("Task not updated");
		}
		return updatedStage[0];
	}

	//* CHECK IN - OUT */ 

	const checkInUser = async (user_id) => {
		const checkIn = await knex(ATTENDANCE_TABLE).insert({
			user_id: user_id,
			datetime: new Date(),
			event: AttendanceEvents.CHECKIN,

		}).returning('datetime');

		if (checkIn.length === 0) throw new Error ("Check in failed");

		return checkIn;
	};

	const checkOutUser = async (user_id) => {
		const checkIn = await knex(ATTENDANCE_TABLE).insert({
			user_id: user_id,
			datetime: new Date(),
			event: AttendanceEvents.CHECKOUT,

		}).returning('datetime');

		if (checkIn.length === 0) throw new Error ("Check out failed");

		return checkIn;
	};
	
	const checkIfUserCheckedIn = async (user_id) => {
		const checkIn = await knex(ATTENDANCE_TABLE).select().where("user_id", user_id).orderBy("datetime", "desc").limit(1);
		if (checkIn.length === 0) return false;
		return checkIn[0].event === AttendanceEvents.CHECKIN;
	};



	/* si quieren hacer cualquier cosa con la database la pueden armar como una funcion
	parecida a las de arriba, usando knex para seleccionar o insertar*/

	return {
		getUser,
		getAllUsers,
		enrollUser,
		append2FA,
		getLast2FA,
		createProject,
		getProject,
		addUserToProject,
		getUserProjects,
		createEpic,
		getEpic,
		getProjectEpics,
		createStory,
		getStory,
		getEpicStories,
		createTask,
		getTask,
		getStoryTasks,
		getUserTasks,
		updateScore,
		updateComplete,
		updateStage,
		checkInUser, 
		checkOutUser,
		checkIfUserCheckedIn
		 /*, resto de funciones */
	};
};

module.exports = {
	databaseServiceFactory,
};
