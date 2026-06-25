const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "day1")));

const FILE = path.join(__dirname, "users.json");

// ✅ Home route (IMPORTANT FIX)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "day1", "index.html"));
});

// ✅ Signup API
app.post("/signup", (req, res) => {
    let users = [];

    // avoid crash if file empty or missing
    if (fs.existsSync(FILE)) {
        users = JSON.parse(fs.readFileSync(FILE, "utf8"));
    }

    users.push(req.body);

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.json({
        success: true,
        message: "Account Created Successfully"
    });
});

// ✅ Login API
app.post("/login", (req, res) => {
    let users = [];

    if (fs.existsSync(FILE)) {
        users = JSON.parse(fs.readFileSync(FILE, "utf8"));
    }

    const user = users.find(
        u => u.email === req.body.email && u.password === req.body.password
    );

    if (user) {
        res.json({ success: true, message: "Login Successful" });
    } else {
        res.json({ success: false, message: "Invalid Email or Password" });
    }
});

// ✅ Render port fix
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});