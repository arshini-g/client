import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = "https://backend-i0h0.onrender.com"; // Use a common base URL here

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("logged_in");
    const userIdFromParams = params.get("user_id");

    if (loggedIn === "True" && userIdFromParams) {
      fetch(`${BASE_URL}/check-user?user_id=${userIdFromParams}`)
        .then((response) => response.json()) // Parse JSON from the response
        .then((data) => {
          console.log(data);
          console.log(data.username);
          setIsLoggedIn(true);
          setUserId(userIdFromParams);
          setUsername(data.username); // Set username from the response
          fetchTasks(userIdFromParams); // Fetch tasks for the user
        })
        .catch((error) => {
          console.error("Error checking user:", error);
        });
    }
  }, []);

  const fetchTasks = (userId) => {
    fetch(`${BASE_URL}/tasks?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => {
        console.error("Error fetching tasks:", error.message);
        alert("An error occurred while fetching tasks. Please try again later.");
      });
  };

  const addTask = (taskTitle, taskDescription) => {
    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskTitle, taskDescription, userId }),
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        fetchTasks(userId); // Refresh the task list
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const markTaskComplete = (taskId) => {
    fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        fetchTasks(userId); // Refresh the task list
      })
      .catch((error) => console.error("Error marking task as complete:", error));
  };

  const editTask = (taskId, taskTitle, taskDescription) => {
    fetch(`${BASE_URL}/tasks/edit/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskTitle, taskDescription }),
    })
      .then((response) => {
        if (response.ok) return response.text();
        throw new Error("Error updating task");
      })
      .then((message) => {
        console.log(message);
        fetchTasks(userId); // Refresh the task list
      })
      .catch((error) => console.error("Error editing task:", error));
  };

  const deleteTask = (taskId) => {
    fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((message) => {
        console.log(message);
        fetchTasks(userId); // Refresh the task list
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleLoginRedirect = () => {
    const original = window.location.origin;
    const loginUrl = process.env.REACT_APP_LOGIN_URL + "/?next=" + original;
    window.location.href = loginUrl;

  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Dashboard
                  username={username}
                  tasks={tasks}
                  addTask={addTask}
                  markTaskComplete={markTaskComplete}
                  editTask={editTask}
                  deleteTask={deleteTask}
                />
              ) : (
                <HomePage handleLoginRedirect={handleLoginRedirect} />

              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ handleLoginRedirect }) {
  return (
    <div
      style={{
        padding: '30px',
        borderRadius: '12px',
        backgroundColor: '#d3bbdd', // Lilac background
        color: '#fff', // White text
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
        width: '80%', // To make the box more centered
        maxWidth: '400px', // Cap the width for better readability on various screens
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginBottom: '20px' }} />
      <h2>Welcome</h2>
      <button
        onClick={handleLoginRedirect}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#efe7d3', // Ivory background
          color: '#333', // Dark text color
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '10px' }} />
        Login/Register
      </button>
    </div>
  );
}

export default App;
