import conn from "../../lib/db.js";
import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();

export default // should be logged in and admin
withSessionRoute(async (req, res) => {
	const method = req.method.toLowerCase();

	if (method !== "get") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		const user = req.session.email;
		const userCredentials = await dbService.getUser(user);

		if (userCredentials.is_admin === true) {
			const users = await dbService.getAllUsers();

			console.log("getting users");

			res.status(200).json({ users });
			return;
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
