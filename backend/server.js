const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require("./routes/taskRoutes");


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Task Manager API running...");
});

app.use("/api/tasks", taskRoutes);


// Start
connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
