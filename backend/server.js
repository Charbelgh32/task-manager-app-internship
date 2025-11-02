
import express from "express";
import cors from "cors";

// read private key of the env file
import dotenv from "dotenv";


//import routes
import tasksRouter from "./src/routes/tasks.js";

// activate variable inside the env file
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend API working");
});


app.use("/api/tasks", tasksRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


