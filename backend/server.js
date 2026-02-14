const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary storage (we’ll replace with DB later)
let reservations = [];

// Receive reservation
app.post("/reservations", (req, res) => {
  reservations.push(req.body);
  res.json({ message: "Reservation saved successfully!" });
});

// View reservations
app.get("/reservations", (req, res) => {
  res.json(reservations);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
