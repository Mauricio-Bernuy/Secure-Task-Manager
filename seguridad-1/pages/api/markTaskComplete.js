import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();

export default // should be logged in
withSessionRoute(async (req, res) => {
	const method = req.method.toLowerCase();

	const { task_id } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}
	try {
		const task = await dbService.getTask(task_id);
		const user = req.session.email;

		if (user && task) {
			const user_data = await dbService.getUser(user);
			if (user_data.id === task.user_id) {
				const userTasks = await dbService.updateComplete(task.id);
				res.status(200).json({ msg: "sucess", userTasks });
				return;
			} else {
				throw new Error("Task does not belong to user");
			}
		} else {
			throw new Error("User not logged in");
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error" });
});
