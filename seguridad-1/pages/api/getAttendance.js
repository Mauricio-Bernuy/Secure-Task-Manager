import conn from "../../lib/db.js";

export default async (req, res) => {
	try {
		console.log("a");
		const query = `SELECT * FROM attendance`;
		const result = await conn.query(query);
		res.status(200).json(result.rows);
	} catch (error) {
		const DatabaseError = error.message;
		console.log(DatabaseError);
		res.status(403).json({ DatabaseError });
	}
	res.status(403).json({ error: "there has been an unknown error", error });
};
