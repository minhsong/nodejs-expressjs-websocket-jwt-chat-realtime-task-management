const { database } = require("../Services/firebase/firebaseAdmin"); // Adjust path as necessary

const tasksRef = database.ref("tasks");

class Task {
  constructor(title, description, status = "pending", assignee = null) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.assignee = assignee;
  }

  async save() {
    try {
      const task = {
        title: this.title,
        description: this.description,
        status: this.status,
        assignee: this.assignee,
      };
      const newTaskRef = await tasksRef.push(task);
      return newTaskRef.key;
    } catch (error) {
      throw new Error("Failed to create task");
    }
  }
}

exports.Task = Task;
