import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(async (req, res) => {
	const user = req.session.email;

	if (user) {
		res.json({
			isLoggedIn: true,
			...user,
		});
	} else {
		res.json({
			isLoggedIn: false,
		});
	}
});
