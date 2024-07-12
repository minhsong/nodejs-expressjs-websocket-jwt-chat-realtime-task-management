import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskFormModal from "./TaskFormModal";
import {
  addTask,
  deleteTask,
  getTasks,
  markTaskAsDone,
  updateTask,
} from "../../services/taskService";
import socketClient from "../../services/socketClient";
import ConfirmModal from "../../components/ConfirmModal/inde";
const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [dataModel, setDataModel] = useState(null);
  const [filter, setFilter] = useState("");
  const [deleteModelData, setDeleteModelData] = useState(null);

  useEffect(() => {
    fetchTasks();
    // add events listeners
    socketClient.addEvent("task.updated", (data) => {
      const newTasks = tasks.map((task) =>
        task.id === data.id ? { ...task, ...data } : task
      );
      setTasks((state) =>
        state.map((task) => (task.id === data.id ? { ...task, ...data } : task))
      );
    });

    socketClient.addEvent("task.created", (data) => {
      setTasks((state) => [...state, data]);
    });

    socketClient.addEvent("task.deleted", (data) => {
      setTasks((state) => state.filter((task) => task.id !== data));
    });

    socketClient.addEvent("task.done", (id) => {
      setTasks((state) =>
        state.map((task) =>
          task.id === id ? { ...task, status: "done" } : task
        )
      );
    });

    return () => {
      // remove event listeners
      socketClient.removeEvent("task.updated");
      socketClient.removeEvent("task.created");
      socketClient.removeEvent("task.deleted");
      socketClient.removeEvent("task.done");
    };
  }, []);

  useEffect(() => {
    if (filter) {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(filter.toLowerCase())
      );
      setTasks(filteredTasks);
    } else {
      fetchTasks();
    }
  }, [filter]);

  const handleAddTask = (data) => {
    if (data.id) {
      updateTask(data).then((res) => {
        if (res.ok) {
          setDataModel(null);
        }
      });
    } else {
      addTask(data).then((res) => {
        if (res.ok) {
          setDataModel(null);
        }
      });
    }
  };

  const fetchTasks = async () => {
    getTasks().then((res) => {
      if (res.ok) {
        setTasks(res.resData);
      }
    });
  };

  const handleMarkAsDone = (id) => {
    markTaskAsDone(id).then((res) => {
      if (res.ok) {
      }
    });
  };

  const handleDeleteTask = (id) => {
    deleteTask(id).then((res) => {
      if (res.ok) {
        setDeleteModelData(null);
      }
    });
  };

  return (
    <div className="p-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Manage Tasks</h1>

      {/* Page Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          Number of Tasks: <span className="font-semibold">{tasks.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FontAwesomeIcon
              icon={["fa", "search"]}
              className="absolute top-3 right-3 text-gray-500"
            />
          </div>
          <button
            onClick={() => setDataModel({ status: "pending" })}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <FontAwesomeIcon icon={["fa", "plus"]} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Assigned
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 border-b border-gray-300">
                {task.title}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {task.status}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {task.assignee?.name}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {task.status}
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                {task.status !== "done" && (
                  <button
                    onClick={() => handleMarkAsDone(task.id)}
                    className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Done
                  </button>
                )}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() =>
                    setDataModel({ ...task, assignee: task.assignee?.id })
                  }
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline ml-4"
                  onClick={() => setDeleteModelData(task)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dataModel && (
        <TaskFormModal
          isOpen={true}
          onClose={() => setDataModel(null)}
          data={dataModel}
          onSubmit={handleAddTask}
        />
      )}

      {deleteModelData && (
        <ConfirmModal
          isOpen={true}
          title={`Delete Task: ${deleteModelData.title}`}
          message="Are you sure you want to delete this task?"
          onConfirm={() => handleDeleteTask(deleteModelData.id)}
          onClose={() => setDeleteModelData(null)}
        />
      )}
    </div>
  );
};

export default TaskManagement;
