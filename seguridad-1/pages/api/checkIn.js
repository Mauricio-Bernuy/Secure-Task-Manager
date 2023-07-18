import { databaseServiceFactory } from "../../services/databaseService";

import { HttpMethods } from "./helpers/httpMethods.ts";
const dbService = databaseServiceFactory();

const postCheckIn = async (req, res) => {
	try {
		const body = req.body;
		if (!body.email) res.status(400).json({ data: "missing email" });
		const user = await dbService.getUser(body.email);
		const user_id = user.id;
		const checkIfCheckId = await dbService.checkIfUserCheckedIn(user_id);
		if (checkIfCheckId)
			res.status(400).json({ data: "user already checked in" });
		const attendanceCheckin = await dbService.checkInUser(user_id);
		const dateTime = attendanceCheckin[0].datetime;
		const responsestring = `Sucessful check in at:  ${dateTime}`;
		res.status(200).json(responsestring);
	} catch (error) {
		console.log("error", error);
	}
};

export default async (req, res) => {
	switch (req.method) {
		case HttpMethods.POST:
			postCheckIn(req, res);
			break;
		case HttpMethods.GET:
		case HttpMethods.PUT:
		case HttpMethods.DELETE:
		default:
			return res.status(400).json({ data: "request must be POST" });
	}
};
