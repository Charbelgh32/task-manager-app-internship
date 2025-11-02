import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login';
import Dash from './Dashboard';
import Registration from './Registration';
import TaskForm from './TaskForm';
import UpdateTask from './UpdateForm';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Registration' element={<Registration />} />
        <Route path='/Dashboard' element={<Dash />} />
        <Route path='/TaskForm' element={<TaskForm />} />
        <Route path="/UpdateTask/:taskId" element={<UpdateTask />} />
        <Route></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
