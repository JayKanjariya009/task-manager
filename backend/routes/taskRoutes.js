const express = require("express");
const router = express.Router();
const {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const {adminMiddleware} = require("../middeware/adminmiddleware")
const { authMiddleware } = require("../middeware/authmiddleware");

router.use(authMiddleware);

router.post("/", createTask); // create task
router.get("/", getMyTasks); // get own tasks
router.put("/:id", updateTask); // update own task
router.delete("/:id", deleteTask); // delete own task

router.get("/all", adminMiddleware, getAllTasks); // admin: get all tasks

module.exports = router;
// This file defines the routes for task management in the application.