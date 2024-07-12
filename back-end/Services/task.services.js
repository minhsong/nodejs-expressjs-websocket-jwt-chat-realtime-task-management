const { Task } = require("../Models/task.model");
const { firebaseAdmin, database } = require("./firebase/firebaseAdmin"); // Adjust path as necessary
const tasksRef = database.ref("tasks");

exports.getTasks = async () => {
  try {
    const snapshot = await tasksRef.once("value");
    const tasksData = snapshot.val();
    if (!tasksData) {
      throw new Error("No tasks found");
    }
    return Object.keys(tasksData).map((id) => ({
      id,
      ...tasksData[id],
    }));
  } catch (error) {
    throw new Error("Failed to fetch tasks: " + error.message);
  }
};

exports.getTask = async (id) => {
  try {
    const snapshot = await tasksRef.child(id).once("value");
    const taskData = snapshot.val();
    if (!taskData) {
      throw new Error("Task not found");
    }
    return { id, ...taskData };
  } catch (error) {
    throw new Error("Failed to fetch task: " + error.message);
  }
};

exports.createTask = async (task) => {
  try {
    const { title, description, status, assignee } = task;

    const newTask = new Task(title, description, status, assignee);
    const taskId = await newTask.save();
    return { id: taskId, ...newTask };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

exports.updateTask = async (id, task) => {
  try {
    const taskRef = tasksRef.child(id);
    await taskRef.update(task);
    return { id, ...task };
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
  }
};

exports.deleteTask = async (id) => {
  try {
    const taskRef = tasksRef.child(id);
    await taskRef.remove();
    return { id };
  } catch (error) {
    throw new Error("Failed to delete task: " + error.message);
  }
};

exports.markTaskAsDone = async (id) => {
  try {
    const taskRef = tasksRef.child(id);
    await taskRef.update({ status: "done" });
    return { id };
  } catch (error) {
    throw new Error("Failed to mark task as done: " + error.message);
  }
};
