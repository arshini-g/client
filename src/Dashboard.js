import React, { useState } from "react";
import "./Dashboard.css"; // Import the CSS for styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faCheckSquare, faSignOut } from "@fortawesome/free-solid-svg-icons";

function Dashboard({ username, tasks, addTask, markTaskComplete, editTask, deleteTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask(taskTitle, taskDescription);
      setTaskTitle("");
      setTaskDescription("");
    } else {
      alert("Task title is required");
    }
  };

  const handleEditTask = () => {
    if (editingTask && taskTitle.trim()) {
      editTask(editingTask, taskTitle, taskDescription);
      setEditingTask(null);
      setTaskTitle("");
      setTaskDescription("");
    } else {
      alert("Task title is required for editing");
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  
    // Clear user-related session data (if any)
    sessionStorage.removeItem('userToken');
    localStorage.removeItem('userToken');
  
    // Redirect to the initial page the app started on
    window.location.href = window.location.origin;
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Hi, {username}, this is your todo list!</h1>
          <button onClick={handleLogout} style={{ float: 'right', marginRight: '10px' }}>
              Logout    <FontAwesomeIcon icon={faSignOut} />
            </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Pending Tasks Section */}
        <section className="dashboard-section pending-tasks">
          <div className="container">
            <h2>Pending Tasks</h2>
            <ul>
              {tasks
                .filter((task) => task.status === "pending")
                .map((task) => (
                  <li key={task.task_id} className="task-item">
                    <div className="task-header">
                      <strong>{task.task_title}</strong>
                      <div className="task-actions">
                        <button onClick={() => markTaskComplete(task.task_id)}>
                          <FontAwesomeIcon icon={faCheckSquare} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTask(task.task_id);
                            setTaskTitle(task.task_title);
                            setTaskDescription(task.task_description);
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button onClick={() => deleteTask(task.task_id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <p className="task-description task-description-edit">{task.task_description}</p>
                  </li>
                ))}
            </ul>
            <h2>{editingTask ? "Edit Task" : "Add a New Task"}</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="task-description-edit"
            />
            {editingTask ? (
              <button onClick={handleEditTask}>
                <FontAwesomeIcon icon={faPen} /> Update Task
              </button>
            ) : (
              <button onClick={handleAddTask}>
                <FontAwesomeIcon icon={faPlus} /> Add Task
              </button>
            )}
          </div>
        </section>

        {/* Completed Tasks Section */}
        <section className="dashboard-section completed-tasks">
          <div className="container">
            <h2>Completed Tasks</h2>
            <ul>
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <li key={task.task_id} className="task-item">
                    <div className="task-header">
                      <strong>{task.task_title}</strong>
                      <div className="task-actions">
                        <button onClick={() => deleteTask(task.task_id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <p className="task-description">{task.task_description}</p>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
