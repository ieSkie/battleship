import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

app.listen(3001, () => console.log("Server: http://localhost:3001"));
