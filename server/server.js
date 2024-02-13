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
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hash],
    (err, result) => {
      if (err)
        return res.json({
          error: "Error while inserting the data",
          description: err,
        });
      return res.json({ status: "Success" });
    }
  );
});

app.post("/login", async (req, res) => {
  console.log(" at login");
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

      return res.json({ status: "Success" });
    } else {
      console.log("not authenticated");
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error("Logging to server error", error);
    return res.status(500).json({ error: "Logging to server error" });
  }
});

// app.post("/login", async (req, res) => {
//   console.log(" at login");
//   const sql = "SELECT * FROM users WHERE email = $1";
//   const email = req.body.email;
//   const password = req.body.password;
//   console.log("email: ", email);

//   const user = await pool.query(sql, [email], (err, data) => {
//     if (err) return res.json({ error: "Logging to server error" });
//     else {
//       console.log("return from email query: ", data.rows[0]);
//     }
//   });

//   if (!user) {
//     console.log("User not found", user);
//     return res.status(401).send("User not found");
//   }

//   // Compare passwords
//   const authenticated = bcrypt.compareSync(password, data.rows[0].password);
//   if (authenticated) {
//     console.log("authenticated");
//     const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
//     res.cookie("token", token, { httpOnly: true });
//     return res.status(200).json({ status: "Success", rows: user });
//   } else {
//     console.log("not authenticated", authenticated);
//     return res.status(401).send("Invalid password");
//   }
// });

app.listen(8081, () => {
  console.log("running on port 8081");
});
