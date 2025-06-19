// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null; // Prevent rendering if not authenticated       
    }
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    setUsername(localStorage.getItem("username") || "");
    setEmail(localStorage.getItem("email") || "");
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null; // Prevent rendering if not authenticated       
    }
    try {
      await axios.post("http://localhost:5000/api/tasks", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      fetchTasks();
    } catch {
      setError("Failed to create task.");
    }
  };

  const handleUpdate = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null; // Prevent rendering if not authenticated       
    }
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTask(null);
      setShowForm(false);
      fetchTasks();
    } catch {
      setError("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null; // Prevent rendering if not authenticated       
    }
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch {
      setError("Failed to delete task.");
    }
  };

  // Task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "Completed").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const pending = tasks.filter(task => task.status === "Pending").length;

    // Find overdue tasks (due date is in the past and not completed)
    const overdue = tasks.filter(task => {
      if (task.status === "Completed") return false;
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return dueDate < today;
    }).length;

    // Find tasks due today
    const dueToday = tasks.filter(task => {
      if (task.status === "Completed") return false;
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      const today = new Date();

      return dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear();
    }).length;

    return { total, completed, inProgress, pending, overdue, dueToday };
  };

  const stats = getTaskStats();

  // Filter tasks based on status
  const filteredTasks = filterStatus === "all"
    ? tasks
    : tasks.filter(task => task.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">Welcome back, {username}!</h1>
          <p className="text-gray-600">Logged in as: {email}</p>
          <p className="text-gray-600">Here's an overview of your tasks</p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold text-indigo-700">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-500">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Due Today</p>
            <p className="text-2xl font-bold text-blue-700">{stats.dueToday}</p>
          </div>
        </div>

        {/* Task Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-indigo-800 mr-4">Your Tasks</h2>
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                className={`px-3 py-2 text-sm ${filterStatus === 'all' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-2 text-sm ${filterStatus === 'Pending' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setFilterStatus('Pending')}
              >
                Pending
              </button>
              <button
                className={`px-3 py-2 text-sm ${filterStatus === 'In Progress' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setFilterStatus('In Progress')}
              >
                In Progress
              </button>
              <button
                className={`px-3 py-2 text-sm ${filterStatus === 'Completed' ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setFilterStatus('Completed')}
              >
                Completed
              </button>
            </div>
          </div>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
            onClick={() => { setEditTask(null); setShowForm(true); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Task
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm
              initialData={editTask || {}}
              onSubmit={editTask ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditTask(null); }}
            />
          </div>
        )}

        {!showForm && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-indigo-500 font-medium">Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task._id} className="relative group">
                  <TaskCard task={task} />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs shadow hover:bg-yellow-600 transition-colors flex items-center"
                      onClick={() => { setEditTask(task); setShowForm(true); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md text-xs shadow hover:bg-red-600 transition-colors flex items-center"
                      onClick={() => handleDelete(task._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No tasks found</p>
                <p className="text-gray-400 mb-4">
                  {filterStatus !== 'all'
                    ? `You don't have any ${filterStatus.toLowerCase()} tasks.`
                    : "You don't have any tasks yet."}
                </p>
                <button
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors inline-flex items-center"
                  onClick={() => { setEditTask(null); setShowForm(true); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create your first task
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
