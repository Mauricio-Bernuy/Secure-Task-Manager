import { withSessionRoute } from "../../lib/session";

export default withSessionRoute(async (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});
