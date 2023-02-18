import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateTask from './task/CreateTask';
import TaskDetail from './task/TaskDetail';
import Dashboard from './user/Dashboard';
import Logout from './user/Logout';
import SignIn from './user/SignIn';
import SignUp from './user/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<SignIn />} />
        <Route path='/home' exact={true} element={<SignIn />} />
        <Route path='/signin' exact={true} element={<SignIn />} />
        <Route path='/login' exact={true} element={<SignIn />} />
        <Route path='/signup' exact={true} element={<SignUp />} />
        <Route path='/dashboard' exact={true} element={<Dashboard />} />
        <Route path='/signout' exact={true} element={<Dashboard />} />
        <Route path='/logout' exact={true} element={<Logout />} />
        <Route path='/createTask' exact={true} element={<CreateTask />} />
        <Route path='/taskDetail' exact={true} element={<TaskDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
