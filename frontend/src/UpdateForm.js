import React, { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";



const UpdateTask = () => {

  const { taskId } = useParams();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  // add loading
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {


    //function to chek that our user is looged in
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("No user Logged In");
        navigate('/');
      } else {
        setUser(user);
      }
    };

    //function to print all user so he can assign to one
    const loadUsers = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch("http://localhost:4000/api/tasks/users/list", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const usersData = await res.json();
      setAllUsers(usersData);
    };

    const fetchTask = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setTitle(data.title);
      setStatus(data.status);
      setStartDate(data.started_date);
      setAssignedTo(data.assigned_user);
    }

    const init = async () => {

      //wait till the three function are finished to continue
      setLoading(true);
      try {
        await Promise.all([loadUser(), loadUsers(), fetchTask()]);
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [taskId, navigate]); 

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    setSaving(true); 

    const token = (await supabase.auth.getSession()).data.session.access_token;

    const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
      method: "PUT",
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

    setSaving(false); 

    if (response.ok) {
      alert("Task Updated ");
      navigate("/Dashboard");
    } else {
      alert("You are not allowed to update the task");
      navigate("/Dashboard");
    }
  };

  // show loading 
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}>
        <div className="loader"></div>
        Loading task details...
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Update Task</h1>

      <form onSubmit={handleUpdateTask} id="task-form">

        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />

        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Assign Task To:</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
          <option value="">Select a User</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.email}</option>
          ))}
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
