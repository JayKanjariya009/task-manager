const Task = require("../models/Task");

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      userId: req.user.userId
    });

    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

// Get tasks for logged-in user
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// Get all tasks (admin only)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("userId", "username email");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all tasks", error: err.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};

module.exports = {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask
};
