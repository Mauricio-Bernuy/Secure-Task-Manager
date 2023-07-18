import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

// import bcrypt

/-* STILL IN DEVELOPMENT */

const dbService = databaseServiceFactory();

export default // should be logged in
withSessionRoute(async (req, res) => {
	// const ERROR_CREDENTIALS = "Invalid email and/or password";

	const method = req.method.toLowerCase();
	// const { email } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		// const user = req.session.email;
		// const user = req.session.email;

		// check if checking for own

		// if (user) {
		// if (user === email) {
		if (true) {
			//* PROJECTS */

			const project = await dbService.createProject(
				"proyecto pogaso",
				"el proyecto pogaso se encargara de facilitar el pogeo en los espacios de trabajo a nivel multinacional."
			);
			console.log(project[0]);
			const user2project = await dbService.addUserToProject(
				"mauricio.bernuy@utec.edu.pe",
				project[0].id
			);
			const getproject = await dbService.getProject(project[0].id);
			const getuserprojects = await dbService.getUserProjects(
				"mauricio.bernuy@utec.edu.pe"
			);

			//* EPICS */

			const epic = await dbService.createEpic(
				"Primer Epic: Pogerizado y Carrearizado",
				"no necesita descripción bro.",
				project[0].id
			);

			console.log(epic[0]);
			const getepic = await dbService.getEpic(epic[0].id);
			const getprojectepics = await dbService.getProjectEpics(
				project[0].id
			);

			//* STORIES */

			const story = await dbService.createStory(
				"Primer Story: Diseñar un PPT locaso",
				"para presentacion a las 6pm",
				epic[0].id
			);

			console.log(story[0]);
			const getstory = await dbService.getStory(story[0].id);
			const getepicstories = await dbService.getEpicStories(epic[0].id);

			//* TASKS */

			// const task = await dbService.createTask("mauricio.bernuy@utec.edu.pe",
			//                                         "Llenar info del ppt",
			//                                         "añadir datos del proyecto",
			//                                         "09/09/2022, 11:00AM",
			//                                         "09/09/2022, 6:00PM",
			//                                         story[0].id)

			// console.log(task[0])
			// const gettask = await dbService.getTask(task[0].id)
			// const getstorytasks = await dbService.getStoryTasks(story[0].id)

			const user2project2 = await dbService.addUserToProject(
				"claudia.noche@utec.edu.pe",
				project[0].id
			);

			const task = await dbService.createTask(
				"claudia.noche@utec.edu.pe",
				"Llenar info del ppt",
				"añadir datos del proyecto",
				"09/09/2022, 11:00AM",
				"09/09/2022, 6:00PM",
				story[0].id
			);

			console.log(task[0]);
			const gettask = await dbService.getTask(task[0].id);
			const getstorytasks = await dbService.getStoryTasks(story[0].id);

			res.status(200).json({
				msg: "project created",
				user2project2,
				gettask,
				getstorytasks,
			});

			// res.status(200).json({ msg: "project created", project, user2project, getproject});
			return;
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error", error });
});
