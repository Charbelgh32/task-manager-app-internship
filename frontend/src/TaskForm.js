import React, { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';


const AddTask = () => {

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("No user Logged In");
        navigate('/');
      } else {
        setUser(user);
      }
    };

    const loadUsers = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch("http://localhost:4000/api/tasks/users/list", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const usersData = await res.json();
      setAllUsers(usersData);
    };

    loadUser();
    loadUsers();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    const token = (await supabase.auth.getSession()).data.session.access_token;

    const response = await fetch("http://localhost:4000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        status,
        started_date: startDate,
        assigned_user: assignedTo, 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Task Created ");
      navigate("/Dashboard");
    } else {
      alert("Error While Creating Task");
    }
  };

  return (
    <div className="container">
      <h1>Create a New Task</h1>

      <form onSubmit={addTask} id="task-form">

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Assign Task To:</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Select a User</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default AddTask;
