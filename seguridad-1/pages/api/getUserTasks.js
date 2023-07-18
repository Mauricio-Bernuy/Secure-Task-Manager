import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();

export default // should be logged in
withSessionRoute(async (req, res) => {
	const method = req.method.toLowerCase();

	const email = req.body;

	if (method !== "get") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}
	try {
		const user = req.session.email;
		console.log(user);

		let validation = true;
		if (email) validation = user === email;

		if (user && validation) {
			const userTasks = await dbService.getUserTasks(user);
			res.status(200).json({ msg: "sucess", userTasks });
			return;
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
