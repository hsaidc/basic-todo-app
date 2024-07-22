import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  lastUpdate: {
    type: Date,
  },
  text: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
