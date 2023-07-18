import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";
import * as bcrypt from "bcryptjs";

const dbService = databaseServiceFactory();
const saltRounds = 11;

export default // should be logged in and admin
withSessionRoute(async (req, res) => {
	const method = req.method.toLowerCase();
	const { first_name, last_name, email, password, is_admin } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		const user = req.session.email;
		const userCredentials = await dbService.getUser(user);

		if (userCredentials.is_admin === true) {
			console.log("is admin!");
			console.log(password, saltRounds);

			bcrypt.hash(password, saltRounds, function (error, hash) {
				console.log(first_name, last_name, email, hash, is_admin);
				dbService.enrollUser(
					first_name,
					last_name,
					email,
					hash,
					is_admin
				);
			});
		} else {
			throw new Error("Not enough priviledges");
		}
		return res.status(200).json({ msg: "Sucessfully added user" });
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error" });
});
