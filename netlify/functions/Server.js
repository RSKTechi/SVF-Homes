const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",     // MySQL host
  user: "root",          // MySQL username
  password: "root",          // MySQL password
  database: "top1"       // Your database name
});

// ✅ Check connection
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submit → save to MySQL
app.post("/submit-form", (req, res) => {
  const { name, email, mobile } = req.body;

  // ✅ Insert into database (table: users)
  const sql = "INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)";
  db.query(sql, [name, email, mobile], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      return res.status(500).send("Database error");
    }
    console.log("✅ Data inserted:", result.insertId);

    // After insert, send thank you page
    res.sendFile(path.join(__dirname, "thank.html"));
  });
});

// Example: Fetch users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
