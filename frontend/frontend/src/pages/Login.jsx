import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const validate = () => {
    const errs = {}
    if (!formData.email) errs.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email"
    if (!formData.password) errs.password = "Password is required"
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
    setApiError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // First, ensure we clear any old data
      localStorage.removeItem('email')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      
      // Always store the email from the form first as a fallback
      localStorage.setItem('email', formData.email)
      
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      console.log("Login response:", res.data)
      
      // Extract data from response
      const { token, username, role, email } = res.data
      
      // Store user data in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('role', role || '')
      localStorage.setItem('username', username || '')
      
      // Make sure email is set, with fallbacks
      if (email) {
        localStorage.setItem('email', email)
      } else if (!localStorage.getItem('email')) {
        localStorage.setItem('email', formData.email)
      }
      
      // Double-check what was stored
      const storedEmail = localStorage.getItem('email')
      console.log("Final stored email:", storedEmail)
      
      // Log what was stored
      console.log("Stored in localStorage:", {
        token,
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email')
      })
      
      // Force a small delay to ensure localStorage is updated
      setTimeout(() => {
        navigate('/dashboard')
      }, 100)
    } catch (err) {
      console.error("Login error:", err)
      setApiError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Login</h2>
        {apiError && <div className="mb-4 text-red-600 text-center">{apiError}</div>}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            autoComplete="username"
          />
          {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            autoComplete="current-password"
          />
          {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition-all font-semibold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
