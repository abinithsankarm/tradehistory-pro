const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Frontend folder
const frontendPath = path.join(__dirname, "day1");

// Serve frontend
app.use(express.static(frontendPath));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Users file
const FILE = path.join(__dirname, "users.json");

// =======================
// EMAIL VALIDATION FUNCTION
// =======================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =======================
// SIGNUP API (FIXED)
// =======================
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // check empty fields
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "All fields required"
        });
    }

    // email validation
    if (!isValidEmail(email)) {
        return res.json({
            success: false,
            message: "Invalid email format"
        });
    }

    let users = [];

    if (fs.existsSync(FILE)) {
        users = JSON.parse(fs.readFileSync(FILE, "utf8"));
    }

    // check duplicate email (IMPORTANT)
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.json({
            success: false,
            message: "Email already registered"
        });
    }

    users.push({ name, email, password });

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.json({
        success: true,
        message: "Account Created Successfully"
    });
});

// =======================
// LOGIN API
// =======================
app.post("/login", (req, res) => {
    let users = [];

    if (fs.existsSync(FILE)) {
        users = JSON.parse(fs.readFileSync(FILE, "utf8"));
    }

    const user = users.find(
        u => u.email === req.body.email && u.password === req.body.password
    );

    if (user) {
        res.json({
            success: true,
            message: "Login Successful"
        });
    } else {
        res.json({
            success: false,
            message: "Invalid Email or Password"
        });
    }
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});