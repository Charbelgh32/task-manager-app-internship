import React, { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
import styles from './Style/admin.module.css';
import { useNavigate } from 'react-router-dom';
import './Style/AddTask.css';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  // Fetch tasks with optional status filter

  const fetchTask = async (status = "all") => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) return;

    // if status=all call the function
    let url = "https://task-manager-app-internship.onrender.com/api/tasks";
    //else call the filter function
    if (status !== "all") url = `https://task-manager-app-internship.onrender.com/api/tasks/status/${status}`;

    try {
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      const tasks = await response.json();
      setTask(Array.isArray(tasks) ? tasks : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTask([]);
    }
  };

  // Handle delete
  const handleDelete = async (Taskid) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const response = await fetch(`https://task-manager-app-internship.onrender.com/api/tasks/${Taskid}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Failed to delete task");
        return;
      }

      alert("Task Deleted Successfully");
      fetchTask(statusFilter); // refetch tasks with current filter
    } catch (error) {
      alert("Network error, please try again");
      console.error(error);
    }
  };

  // Get logged user
  useEffect(() => {
    const FindUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        alert("No user Logged In");
        navigate('/');
      } else {
        setUser(user);
        await fetchTask();
      }
    };

    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([FindUser()]);
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const Logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error Logging out Try again");
    } else {
      alert("Logged out Successfully");
      navigate('/');
    }
  };

  // Show loading
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}>
        <div className="loader"></div>
        Loading task ...
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ width: "95%", maxWidth: "1300px" }}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          <h1 className={styles.title} id="welcomeMessage">
            Welcome! {user?.email}
          </h1>
          <h3 id="userEmail"></h3>
        </div>
      </div>

      <h1>Your Assigned Tasks</h1>
      <div id="message"></div>

      {}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchTask(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <table id="usersTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned By</th>
            <th>Created at</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(task) && task.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.created}</td>
              <td>{t.created_at}</td>
              <td>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
                <button onClick={() => navigate(`/UpdateTask/${t.id}`)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={Logout} id="logoutButton">Logout</button>
      <button id="logoutButton" onClick={() => navigate("/TaskForm")}>Add a Task</button>
    </div>
  );
};

export default HomePage;
