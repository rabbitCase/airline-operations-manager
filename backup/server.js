const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
require("dotenv").config();
const sql = require("mysql2");

const PORT = process.env.port || 3500;

const password = process.env.DB_PASSWORD;

// const database = sql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: password,
// 	database: "airport_db",
// 	connectionLimit: 50,
// });

// database.query(`show tables;`, (err, result) => {
// 	if (err) {
// 		console.error("Query error:", err);
// 		return;
// 	}
// 	console.log("Query result:", result);
// 	database.end((err) => {
// 		if (err) {
// 			console.error("Error ending the connection:", err);
// 			return;
// 		}
// 		console.log("Connection closed.");
// 	});
// });

// Custom middleware logger
app.use(logger);

// cors = Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded data aka form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json files
app.use(express.json());

// Built-in middleware to serve static files
app.use(express.static(path.join(__dirname, "../frontend")));

// app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
// app.use("/subdir", require("./routes/subdir"));
app.use("/createNewLostAndFound", require("./routes/api/lostAndFound"));

// Route handlers
// app.get(
// 	"/hello(.html)?",
// 	(req, res, next) => {
// 		console.log("attempted to load hello.html");
// 		next();
// 	},
// 	(req, res) => {
// 		res.send("Hello World!");
// 	}
// );

// const one = (req, res, next) => {
// 	console.log("one");
// 	next();
// };

// const two = (req, res, next) => {
// 	console.log("two");
// 	next();
// };

// const three = (req, res) => {
// 	console.log("three");
// 	res.send("Finished!");
// };

// app.get("/chain(.html)?", [one, two, three]);

// app.all("*", (req, res) => {
// 	res.status(404);
// 	if (req.accepts("html")) {
// 		res.sendFile(path.join(__dirname, "pages", "404.html"));
// 	} else if (req.accepts("json")) {
// 		res.json({ err: "404 Not Found" });
// 	} else {
// 		res.type("text").send("404 Not Found");
// 	}
// });

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
