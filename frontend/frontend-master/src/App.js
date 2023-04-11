import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Admin from './Pages/Admin';
import UserInterface from './Pages/UserInterface';
import QuestSolver from "./Pages/QuestSolver";
import QuestCreator from "./Pages/QuestCreator";


function App() {
  
    
  return (

    <div className="App">
      <Router>
        <Routes >
          <Route path="/login" element={<Login key="login" />} />
          <Route path="/register" element={<Register key="register" />} />
          <Route path="/home" element={<Home key="home" />} />
          <Route path="/admin" element={<Admin key="admin" />} />
          <Route path="/user" element={<UserInterface key="user" />} />
          <Route path="/questSolver" element={<QuestSolver key="questSolver" />} />
          <Route path="/questCreator" element={<QuestCreator key="questCreator" />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;