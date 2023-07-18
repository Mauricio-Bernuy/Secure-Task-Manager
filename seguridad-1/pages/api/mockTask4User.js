import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();

export default // should be logged in and admin
withSessionRoute(async (req, res) => {
	const method = req.method.toLowerCase();
	const { email } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		const user = req.session.email;
		const userCredentials = await dbService.getUser(user);

		if (userCredentials.is_admin === true) {
			console.log("is admin!");

			//* PROJECTS */

			const project = await dbService.createProject(
				"Proyecto Mock",
				"el proyecto mock se encargara de facilitar el mocking en los espacios de trabajo a nivel multinacional."
			);
			const user2project = await dbService.addUserToProject(
				email,
				project[0].id
			);

			const getproject = await dbService.getProject(project[0].id);
			console.log(getproject);

			//* EPICS */

			const epic = await dbService.createEpic(
				"Mock Epic: Mockeado y Testeado",
				"inserte descripción genérica",
				project[0].id
			);

			const getepic = await dbService.getEpic(epic[0].id);
			console.log(getepic);

			//* STORIES */

			const story = await dbService.createStory(
				"Mock Story: Presentar el Proyecto",
				"empieza a las 6pm",
				epic[0].id
			);

			const getstory = await dbService.getStory(story[0].id);
			console.log(getstory);

			const task = await dbService.createTask(
				email,
				"Mostrar la funcionalidad del proyecto",
				"mostrar factores de seguridad implementados",
				"09/09/2022, 6:00PM",
				"09/09/2022, 8:00PM",
				story[0].id
			);

			const gettask = await dbService.getTask(task[0].id);
			console.log(gettask);

			return res
				.status(200)
				.json({
					msg: "Mock creation completed",
					getproject,
					getepic,
					getstory,
					gettask,
				});
		} else {
			throw new Error("Not enough priviledges");
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error" });
});
