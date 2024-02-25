const path = require("path");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool, Client } = require("pg");

const jwt = require("jsonwebtoken");
cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("client: " + client.toString());
    const { rows } = await client.query("SELECT current_user");
    const currentUser = rows[0]["current_user"];
    console.log(currentUser);
    console.log("connected to database");
  } catch (err) {
    console.error("Error connecting to database", err);
  } finally {
    (client) => client.release();
  }
})();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const salt = 10;

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hash = bcrypt.hashSync(password, salt);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hash],
    (err, result) => {
      if (err)
        return res.json({
          error: "Error while inserting the data",
          description: err,
        });
      return res.json({
        userid: result.rows[0].userid,
        status: "Success",
      });
    }
  );
});

app.post("/login", async (req, res) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const email = req.body.email;
  const password = req.body.password;
  console.log("email: ", email);

  try {
    const { rows } = await pool.query(sql, [email]);
    if (!rows || rows.length === 0) {
      console.log("User not found");
      return res.status(401).send("User not found");
    }

    // Compare passwords
    const authenticated = bcrypt.compareSync(password, rows[0].password);
    if (authenticated) {
      console.log("authenticated");

      return res.json({
        userid: rows[0].userid,
        status: "Success",
      });
    } else {
      console.log("not authenticated");
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error("Logging to server error", error);
    return res.status(500).json({ error: "Logging to server error" });
  }
});

app.post("/addtrx", async (req, res) => {
  const userid = req.body.userid;
  const amount = req.body.amount;
  const description = req.body.description;
  const type = req.body.type;
  console.log("req: ", req);
  console.log("req.body: ", req.body);

  pool.query(
    "INSERT INTO transactions (userid, amount, description, type) VALUES ($1, $2, $3, $4) RETURNING *",
    [userid, amount, description, type],
    (err, result) => {
      if (err)
        return res.json({
          error: "Error while inserting the data",
          description: err,
        });
      return res.json({
        status: "Success",
      });
    }
  );
});

app.listen(8081, () => {
  console.log("running on port 8081");
});
