const sql = require("mysql2");
const password = process.env.DB_PASSWORD;

const createNewLostAndFound = (req, res) => {
	const database = sql.createConnection({
		host: "localhost",
		user: "root",
		password: password,
		database: "airport_db",
		connectionLimit: 50,
	});

	database.query(
		`insert into lostandfound values(${req.body.itemid}, ${req.body.airportid}, '${req.body.date}', '${req.body.description}');`,
		(err, result) => {
			if (err) {
				console.error("Query error:", err);
				return;
			}
			console.log("Query result:", result);
			database.end((err) => {
				if (err) {
					console.error("Error ending the connection:", err);
					return;
				}
				console.log("Connection closed.");
			});
		}
	);
	console.log(req.body);
	return res.status(201);
};

module.exports = createNewLostAndFound;
