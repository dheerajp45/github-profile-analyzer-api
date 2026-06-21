import express from "express"
const app = express();
import pool from "./db/connection.js";
import { PORT } from "./config/env.js";
import githubRouter from "./routes/githubRoute.js"
import profileRouter from "./routes/profileRoutes.js";

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/github", githubRouter);
app.use("/api/profiles", profileRouter);



  app.listen(PORT,async ()=>{
    try {
      await pool.query("SELECT 1");
      console.log("MySQL connected");
    } catch (err) {
      console.error("MySQL connection failed:", err.message);
    }
    console.log(`server running on http://localhost:${PORT}`);
    // await connectDB();

})