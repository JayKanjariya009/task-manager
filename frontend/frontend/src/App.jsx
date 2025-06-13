// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminTasks from "./pages/AdminTasks";
import Login from "./pages/Login";
import Register from "./pages/Register";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return token && role === "admin" ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100">
      <Router>
        <Routes>
          <Route path="/dashboard" element={
            <RequireAuth><Dashboard /></RequireAuth>
          } />
          <Route path="/admin-tasks" element={
            <RequireAdmin><AdminTasks /></RequireAdmin>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
