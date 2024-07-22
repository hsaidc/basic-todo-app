import express from "express";

// Authentication Middleware
import verifyToken from "../middlewares/verifyToken.js";

// Model
import Task from "../models/task.js";

const router = express.Router();

/**
 * Creates a new task for the authenticated user.
 *
 * This route handler receives task data in the request body, adds the authenticated user's ID to it,
 * and attempts to save the new task to the database. Upon successful creation, it responds with the
 * status code 200 and the newly created task's ID. If the task creation fails, it responds with
 * status code 400 and the error message.
 *
 * @param {Object} req - The request object, containing the task data in the body and the authenticated user's information.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
router.post("/", verifyToken, (req, res) => {
  const data = req.body;
  data.userID = req.user._id;

  const task = new Task(data);
  task
    .save()
    .then(() => {
      res.status(200).json({ status: true, data: task._id });
    })
    .catch((err) => {
      res.status(400).send({ status: false, data: err.message });
    });
});

/**
 * Retrieves a list of tasks for the authenticated user based on query parameters.
 *
 * This endpoint supports filtering by task status, searching by text within tasks, and sorting tasks by date.
 * The authenticated user's ID is used to fetch only their tasks. The tasks can be sorted in ascending or descending
 * order based on the 'sort' query parameter. If no tasks are found, an empty array is returned.
 *
 * @param {Object} req - The request object. It contains query parameters for 'status', 'search', and 'sort'.
 *                       'status' filters tasks by their status (e.g., 'completed').
 *                       'search' allows for text search within task descriptions.
 *                       'sort' determines the sort order of the tasks based on date ('asc' for ascending, 'desc' for descending).
 * @param {Object} res - The response object used to send back the HTTP response with the list of tasks or an error message.
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    let status = req.query.status;
    let search = req.query.search;
    let sort = req.query.sort;

    let sortOption = 1;
    if (sort && sort === "desc") {
      sortOption = -1;
    }

    const filters = {
      userID: req.user._id,
      status: status,
    };

    // Create a regex using users input to search in database
    if (search !== "") filters.text = new RegExp(search, "i");

    let tasks;
    try {
      tasks = await Task.find(filters).sort({ date: sortOption });
    } catch (err) {
      throw new Error("Error while fetching tasks");
    }

    res.status(200).json({ status: true, data: tasks });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message.message });
  }
});

/**
 * Updates a specific task identified by a unique key.
 *
 * This route handler updates the text, lastUpdate, and status fields of a task based on the provided
 * body parameters. It searches for the task by the 'key' provided in the request body. If the task is
 * successfully found and updated, it returns the updated task data with a 200 status code. In case of
 * any errors during the update operation, it responds with a 500 status code and the error message.
 *
 * @param {Object} req - The request object, containing the task's unique key and the new values for text,
 *                       lastUpdate, and status in the body.
 * @param {Object} res - The response object used to send back the HTTP response with the updated task data
 *                       or an error message.
 */
router.put("/", verifyToken, (req, res) => {
  Task.findOneAndUpdate(
    { key: req.body.key },
    { text: req.body.text, lastUpdate: req.body.lastUpdate, status: req.body.status },
    { new: true }
  )
    .then((result) => {
      res.status(200).json({ status: true, data: result.body });
    })
    .catch((err) => {
      res.status(500).send({ status: false, data: err.message });
    });
});

/**
 * Deletes a specific task identified by a unique key.
 *
 * This route handler is responsible for deleting a task based on the 'taskKey' provided in the request body.
 * It uses the `Task.findOneAndDelete` method to locate and remove the task from the database. If the operation
 * is successful, it responds with a 200 status code and a confirmation message. In case of failure, such as
 * if the task cannot be found or a database error occurs, it responds with a 500 status code and the error message.
 *
 * Note: This endpoint requires a valid token to be accessed, as indicated by the `verifyToken` middleware.
 *
 * @param {Object} req - The request object, containing the 'taskKey' in the body to identify the task to be deleted.
 * @param {Object} res - The response object used to send back the HTTP response with either a success or error message.
 */
router.delete("/", verifyToken, (req, res) => {
  Task.findOneAndDelete({ key: req.body.taskKey })
    .then((res) => {
      res.status(200).json({ status: true, data: res });
    })
    .catch((err) => {
      res.status(500).json({ status: false, data: err.message });
    });
});

// Not used in the frontend
/**
 * Searches for tasks based on a text query provided by the user.
 *
 * This endpoint allows authenticated users to search for their tasks containing specific text. It performs
 * a case-insensitive search using MongoDB's `$regex` operator on the 'text' field of tasks. Only tasks
 * belonging to the authenticated user, identified by their user ID stored in `req.user._id`, are searched.
 *
 * @param {Object} req - The request object, containing the user's authentication information and the search query
 *                       in `req.query.text`.
 * @param {Object} res - The response object used to send back the HTTP response. On success, it returns a 200 status
 *                       code along with an array of tasks that match the search criteria. On failure, it returns a
 *                       500 status code with an error message.
 */
router.get("/search", verifyToken, async (req, res) => {
  try {
    const filteredTasks = await Task.find({
      userID: req.user._id,
      text: { $regex: req.query.text, $options: "i" },
    });
    res.status(200).json({ status: true, data: filteredTasks });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
});

export default router;
