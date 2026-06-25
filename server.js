const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 MUST be correct
const frontendPath = path.join(__dirname, "day1");

// serve frontend
app.use(express.static(frontendPath));

// home route → MUST NOT show text
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

const FILE = path.join(__dirname, "users.json");

// signup
app.post("/signup", (req, res) => {
    let users = [];

    if (fs.existsSync(FILE)) {
        users = JSON.parse(fs.readFileSync(FILE, "utf8"));
    }

    users.push(req.body);

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.json({ success: true, message: "Account Created Successfully" });
});

// login
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});