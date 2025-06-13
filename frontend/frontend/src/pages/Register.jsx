import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const validate = () => {
    const errs = {}
    if (!formData.username) errs.username = "Username is required"
    else if (formData.username.length < 3) errs.username = "Username must be at least 3 characters"
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

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData)
      if (res.data.success !== false) {
        navigate('/login')
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Register</h2>
        {apiError && <div className="mb-4 text-red-600 text-center">{apiError}</div>}
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.username ? "border-red-500" : "border-gray-300"}`}
            autoComplete="username"
          />
          {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            autoComplete="email"
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
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            autoComplete="new-password"
          />
          {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition-all font-semibold"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  )
}

export default Register
