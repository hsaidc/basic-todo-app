// Packages
import express from "express"; // Back-end framework
import mongoose from "mongoose"; // Database
import dotenv from "dotenv"; // Environment variables
import cors from "cors";

// Middleware
import logger from "./middlewares/logger.js";

// Routes
// import addTaskRoute from "./routes/addTaskRoute.js";
// import deleteTaskRoute from "./routes/deleteTaskRoute.js";
// import listTasksRoute from "./routes/listTasksRoute.js";
// import filterTasksRoute from "./routes/filterTasksRoute.js";
// import updateTaskRoute from "./routes/updateTaskRoute.js";

import auth from "./routes/auth.js";
import tasks from "./routes/tasks.js";
//////////////////////////////////////////////////////////////////////////////
// Import environment variables from .env file and parse
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const port = process.env.PORT || 8080;
//////////////////////////////////////////////////////////////////////////////
// Instantiate express server and configure for connections
const server = express();

// console.log(MONGODB_URI, port);

// Server configs
server.use(cors()); // Allow access
server.use(logger); // commandline loger
server.use(express.json()); // Required to parse request body
server.use(express.urlencoded({ extended: true }));

// Routes
server.use("/api/tasks", tasks);
server.use("/api/auth", auth);

server.get("/api", (req, res) => {
  res.send({ status: "true", msg: "Server is UP!" });
});

// Connect do DB and start listening on defined port
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

export default server;
