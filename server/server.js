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

app.post("/register", (req, res) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      return res.json({ error: "Error while hashing the password" });
    }

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err, result) => {
        if (err) return res.json({ error: "Error while inserting the data" });
        return res.json({ Status: "Success" });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ error: "Logging to server error" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ error: "passport compare error" });
          if (response) {
            return res.json({ status: "Success" });
          } else {
            return res.json({ error: "password not matched" });
          }
        }
      );
    } else {
      return res.json({ error: "email does not exist" });
    }
  });
});

app.listen(8081, () => {
  console.log("running on port 8081");
});
