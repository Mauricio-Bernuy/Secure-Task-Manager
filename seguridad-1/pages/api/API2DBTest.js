import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();

export default // should be logged in
withSessionRoute(async (req, res) => {
	// const ERROR_CREDENTIALS = "Invalid email and/or password";

	const method = req.method.toLowerCase();
	// const { email } = req.body;

	// if (method !== "post") {
	// 	return res.status(405).end(`Method ${req.method} Not allowed`);
	// }

	try {
		if (true) {
			/// MOCK API para una task

			//* PROJECTS */

			const project = await dbService.createProject(
				"proyecto TASK",
				"el proyecto TASK se encargara de facilitar las TASKS en los espacios de trabajo a nivel multinacional."
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
				"Primer Epic: Tasks assigned",
				"no necesita descripción.",
				project[0].id
			);

			console.log(epic[0]);
			const getepic = await dbService.getEpic(epic[0].id);
			const getprojectepics = await dbService.getProjectEpics(
				project[0].id
			);

			//* STORIES */

			const story = await dbService.createStory(
				"Primer Story: Diseñar un PPT",
				"para presentacion final",
				epic[0].id
			);

			console.log(story[0]);
			const getstory = await dbService.getStory(story[0].id);
			const getepicstories = await dbService.getEpicStories(epic[0].id);

			//* TASKS */

			const task = await dbService.createTask(
				"mauricio.bernuy@utec.edu.pe",
				"Llenar info del ppt",
				"añadir datos del proyecto",
				"07/02/2023, 7:00AM",
				"07/02/2023, 9:00AM",
				story[0].id
			);

			console.log(task[0]);
			const gettask = await dbService.getTask(task[0].id);
			// const getstorytasks = await dbService.getStoryTasks(story[0].id)

			const user2project2 = await dbService.addUserToProject(
				"claudia.noche@utec.edu.pe",
				project[0].id
			);

			const task2 = await dbService.createTask(
				"claudia.noche@utec.edu.pe",
				"Diseñar layout del ppt",
				"ponerle un buen formato y que se vea bien",
				"07/02/2023, 7:00AM",
				"07/02/2023, 9:00AM",
				story[0].id
			);

			console.log(task2[0]);
			const gettask2 = await dbService.getTask(task2[0].id);
			const getstorytasks = await dbService.getStoryTasks(story[0].id);

			res.status(200).json({
				msg: "test response",
				gettask,
				user2project2,
				gettask2,
				getstorytasks,
			});

			return;
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error" });
});
