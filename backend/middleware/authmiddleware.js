const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized access.",
            message: "Token missing or invalid format."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded JWT:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT Error:", error.message);
        return res.status(401).json({
            success: false,
            error: "Invalid token.",
            message: "Session expired or token invalid. Please log in again."
        });
    }
};

module.exports = { authMiddleware };
