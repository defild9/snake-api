const express = require("express");
const db = require("./libs/db.js");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    res.json({ message: "Hello" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-scores", async (req, res) => {
  const { name, score } = req.body;

  if (!name || !score) {
    return res.status(400).send("Missing name or score");
  }

  try {
    const result = await db.query(
      `INSERT INTO players (name, score) 
         VALUES ($1, $2) 
         ON CONFLICT (name) 
         DO UPDATE SET score = EXCLUDED.score 
         RETURNING *`,
      [name, score]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/leaderboard", async (req, res) => {
  const result = await db.query(
    "SELECT name, score FROM players ORDER BY score DESC LIMIT 10"
  );
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
