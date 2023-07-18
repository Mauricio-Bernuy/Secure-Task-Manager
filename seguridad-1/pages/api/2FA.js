import { databaseServiceFactory } from "../../services/databaseService";
import { authServiceFactory } from "../../services/authService";
import { withSessionRoute } from "../../lib/session";

const dbService = databaseServiceFactory();
const authService = authServiceFactory();

export default withSessionRoute(async (req, res) => {
	const ERROR_CREDENTIALS = "Invalid _2FA code";

	const method = req.method.toLowerCase();
	const { email, _2FA } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}

	try {
		// const userCredentials = await dbService.getUser(email);
		const user2FA = await dbService.getLast2FA(email);
		console.log("gotten");

		console.log(user2FA);
		// const isAdmin = user2FA.is_admin;
		if (
			// (await authService.validate(password, userCredentials.password)) ===
			// true
			user2FA._2fa_code === _2FA
		) {
			console.log("2FA MATCH!!!!!!!!!!!!");
			const userCredentials = await dbService.getUser(email);
			const isAdmin = userCredentials.is_admin;
			await saveSession(email, isAdmin, req);

			res.status(200).json({ msg: "2FA step sucess", email, isAdmin });
			return;
		}
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: ERROR_CREDENTIALS });
});

async function saveSession(email, isAdmin, request) {
	request.session.email = email;
	request.session.isAdmin = isAdmin;
	console.log(request.session);
	await request.session.save();
}
