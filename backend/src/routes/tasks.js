import express from "express";
import { supabase } from "../../supabaseClient.js";

const router = express.Router();


//fetch task from a user token send from the front-end

router.get("/", async (req, res) => {
    try {

         // Verify the token before performing the operation
         const token = req.headers.authorization?.split(" ")[1];
         if (!token) return res.status(401).json({ error: "No token" });

         //check if the user is logged in
         const { data: { user }, error: userError } = await supabase.auth.getUser(token);
         if (userError || !user) return res.status(401).json({ error: "Invalid token" });

         // select all the task of this user
         const { data, error } = await supabase
         .from("tasks")
         .select("*")
         .or(`assigned_user.eq.${user.id},created_by.eq.${user.id}`);
         

         if (error) return res.status(500).json({ error: error.message });
         res.json(data);}


         catch (err) {
         res.status(500).json({ error: "Server error" });
         }


    }
);


router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: "Invalid token" });

    const taskId = req.params.id;

    // First check if the task exists and belongs to the user
    const { data: taskData, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .eq("created_by", user.id)
      .single();

    if (fetchError || !taskData) {
      return res.status(403).json({ error: "You are not allowed to delete this task" });
    }

    // Delete the task
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Task deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});




//create a task
router.post("/", async (req, res) => {

    // Verify the token before performing the operation
     const token = req.headers.authorization?.split(" ")[1];
     if (!token) return res.status(401).json({ error: "No token" });

    //check if the user is logged in
     const { data: { user }, error: userError } = await supabase.auth.getUser(token);
     if (userError || !user) return res.status(401).json({ error: "Invalid token" });

     const { title, status, started_date,assigned_user } = req.body;


       const { error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          status: status,
          started_date:started_date,
          assigned_user,
          created_by:user.id

        },
     ]);

     if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Task created" });
     

});


//get all user so user can choose who to add task to

router.get("/users/list", async (req, res) => {

    // Verify the token before performing the operation
     const token = req.headers.authorization?.split(" ")[1];
     if (!token) return res.status(401).json({ error: "No token" });

    //check if the user is logged in
     const { data: { user }, error: userError } = await supabase.auth.getUser(token);
     if (userError || !user) return res.status(401).json({ error: "Invalid token" });

     //fetch all user
     const { data, error } = await supabase.auth.admin.listUsers();

     const users = data.users.map(u => ({
     id: u.id,
     email: u.email
     }));

     res.json(users);

});

//make the update function

router.put("/:id", async (req, res) => {

    // Verify the token before performing the operation
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) 
        return res.status(401).json({ error: "No token" });

    // Check if the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) 
        return res.status(401).json({ error: "Invalid token" });

    const taskId=req.params.id;
    const { title, status, started_date, assigned_user } = req.body;

    const { data, error } = await supabase

        .from("tasks")
        .update([
            {
                title:         title,
                status:        status,
                started_date:  started_date,
                assigned_user: assigned_user,
                created_by:    user.id
            }
        ])
        .eq("id", taskId)
        .eq("created_by", user.id)
        .select();
      
      
    if (!data || data.length === 0) {
    return res.status(403).json({ error: "You are not allowed to delete this task" });}

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Task updated successfully", task: data });

   

});


// make a function to get all the task info

router.get("/:id", async (req, res) => {

    // Verify the token before performing the operation
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) 
        return res.status(401).json({ error: "No token" });

    // Check if the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) 
        return res.status(401).json({ error: "Invalid token" });

    const { id } = req.params;

    const { data, error } = await supabase

        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return res.status(400).json({ error: error.message });

      res.json(data);


});

//make a function to filter task

router.get("/status/:status", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: "Invalid token" });

    const { status } = req.params;

    // Select tasks that belong to the user and match the status
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .or(`assigned_user.eq.${user.id},created_by.eq.${user.id}`)
      .eq("status", status);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});







export default router;