import { databaseServiceFactory } from "../../services/databaseService";
import { authServiceFactory } from "../../services/authService";
import { mailServiceFactory } from "../../services/mailService";
import { withSessionRoute } from "../../lib/session";

var crypto = require("crypto");


const dbService = databaseServiceFactory();
const authService = authServiceFactory();
const mailService = mailServiceFactory();

export default withSessionRoute(async (req, res) => {
	const ERROR_CREDENTIALS = "Invalid email and/or password";

	const method = req.method.toLowerCase();
	const { email, password } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		const userCredentials = await dbService.getUser(email);
		console.log("gotten");

		console.log(userCredentials);
		const isAdmin = userCredentials.is_admin;
		if (
			(await authService.validate(password, userCredentials.password)) ===
			true
		) {
			var _2FA = crypto.randomBytes(8).toString('hex');
			console.log("2FA code to send:", _2FA);

			const append = await dbService.append2FA(email, _2FA);
			await mailService.send2FA(email, _2FA);

			res.status(200).json({ msg: "login step sucess", email, isAdmin });

			return;
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: ERROR_CREDENTIALS });
});