// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check for token and redirect if not present
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Get values from localStorage
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    
    // Log values for debugging
    console.log("Header - localStorage values:", { 
      token, 
      role: storedRole, 
      username: storedUsername, 
      email: storedEmail 
    });
    
    // Set state with values from localStorage
    setRole(storedRole || "");
    setUsername(storedUsername || "");
    setEmail(storedEmail || "");
    
    // Force a re-render if values are missing
    if (!storedUsername && !storedEmail) {
      console.log("Username and email missing, checking localStorage again");
      // Try to get values again after a short delay
      setTimeout(() => {
        const retryUsername = localStorage.getItem("username");
        const retryEmail = localStorage.getItem("email");
        if (retryUsername || retryEmail) {
          setUsername(retryUsername || "");
          setEmail(retryEmail || "");
        }
      }, 500);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  // Debug function to check localStorage
  const debugLocalStorage = () => {
    const items = {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role")
    };
    console.log("Current localStorage items:", items);
    alert(`Current email: ${items.email || "Not found"}\nUsername: ${items.username || "Not found"}`);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white p-4 flex justify-between items-center shadow-lg rounded-b-xl">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <span className="bg-white text-indigo-700 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md border-2 border-indigo-300 group-hover:border-white transition-all duration-300">
            {username ? username[0].toUpperCase() : "U"}
          </span>
          <div className="absolute left-0 top-14 bg-white text-indigo-800 rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 w-48">
            <p className="font-semibold text-lg border-b border-indigo-100 pb-1 mb-1">{username}</p>
            <p className="text-sm text-indigo-600">{email}</p>
            <p className="text-sm text-indigo-600 capitalize">Role: {role || "User"}</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-wide">Task Manager</h1>
      </div>
      <div className="flex items-center">
        <div className="mr-4 bg-indigo-900 bg-opacity-30 py-1 px-3 rounded-full text-sm">
          <span className="opacity-75">Logged in as: </span>
          <span className="font-semibold">
            {localStorage.getItem("email") || "User"}
          </span>
          <span className="ml-2 bg-indigo-500 text-xs py-0.5 px-2 rounded-full capitalize">{role || "User"}</span>
        </div>
        <nav className="flex gap-4 text-lg items-center">
          <Link to="/dashboard" className="hover:text-indigo-200 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </Link>
          {role === "admin" && (
            <Link to="/admin-tasks" className="hover:text-indigo-200 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              All Tasks
            </Link>
          )}
          <button
            onClick={debugLocalStorage}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2 flex items-center shadow-md mr-2"
          >
            Debug
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
              <path d="M4 8a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z" />
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
