import { databaseServiceFactory } from "../../services/databaseService";
import { withSessionRoute } from "../../lib/session";

// import bcrypt

const dbService = databaseServiceFactory();

export default // should be logged in
withSessionRoute
(async (req, res) => {

	const method = req.method.toLowerCase();
	const { email, title, description, start_date, end_date } = req.body;

	if (method !== "post") {
		return res.status(405).end(`Method ${req.method} Not allowed`);
	}
    
	try {
        if(true){
            const newtask = dbService.addUserTasks(email, title, description, start_date, end_date)
			res.status(200).json({ msg: "gotten tasks", newtask });
			return;
		}
	} catch (error) {
        const DatabaseError = error.message
		console.log(DatabaseError);
        res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error", error});
});
