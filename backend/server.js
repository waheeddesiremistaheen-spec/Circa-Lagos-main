const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   POSTGRESQL CONNECTION
================================ */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

// Test DB connection
pool.connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch(err => console.error("Database connection error:", err));

/* ===============================
   CREATE TABLE IF NOT EXISTS
================================ */

pool.query(`
  CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    date VARCHAR(50),
    time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`)
.then(() => console.log("Reservations table ready"))
.catch(err => console.error(err));


/* ===============================
   ROUTES
================================ */

// Home route (so Render doesn't crash)
app.get("/", (req, res) => {
  res.send("Circa Lagos Backend Running");
});

// Save reservation
app.post("/reservations", async (req, res) => {
  const { name, email, date, time } = req.body;

  try {
    const newReservation = await pool.query(
      "INSERT INTO reservations (name, email, date, time) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, date, time]
    );

    res.json({
      message: "Reservation saved successfully!",
      data: newReservation.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all reservations
app.get("/reservations", async (req, res) => {
  try {
    const allReservations = await pool.query(
      "SELECT * FROM reservations ORDER BY created_at DESC"
    );

    res.json(allReservations.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ===============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
