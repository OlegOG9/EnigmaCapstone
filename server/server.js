const path = require("path");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool, Client } = require("pg");

const jwt = require("jsonwebtoken");
cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

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

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      return res.json({ error: "Error while hashing the password" });
    }

    pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, password],
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
});

app.post("/login", async (req, res) => {
  console.log(" at login");
  const sql = "SELECT * FROM users WHERE email = $1";
  const email = req.body.email;
  pool.query(sql, [email], (err, data) => {
    if (err) return res.json({ error: "Logging to server error" });
    console.log("data: ", data.rows[0]);
    return res.status(200).json(data);
    // if (data.length > 0) {
    //   console.log("data: ", data);
    //   console.log("res: ", res);
    // bcrypt.compare(
    //   req.body.password.toString(),
    //   data[0].password,
    //   (err, response) => {
    //     if (err) return res.json({ error: "passport compare error" });
    //     if (response) {
    //       return res.json({ status: "Success" });
    //     } else {
    //       return res.json({ error: "password not matched" });
    //     }
    //   }
    // );
    // } else {
    //   console.log("data.length: ", data.length);
    //   return res.json({ error: "email does not exist" });
    // }
  });
});

app.listen(8081, () => {
  console.log("running on port 8081");
});
