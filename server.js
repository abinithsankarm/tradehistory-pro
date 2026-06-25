const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 THIS IS THE FIX (serve frontend)
app.use(express.static(path.join(__dirname, "day1")));

const FILE = "users.json";

// Home page → index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "day1", "index.html"));
});

// signup
app.post("/signup", (req, res) => {
    const users = JSON.parse(fs.readFileSync(FILE));

    users.push(req.body);

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.json({
        success: true,
        message: "Account Created Successfully"
    });
});

// login
app.post("/login", (req, res) => {
    const users = JSON.parse(fs.readFileSync(FILE));

    const user = users.find(
        u => u.email === req.body.email && u.password === req.body.password
    );

    if (user) {
        res.json({ success: true, message: "Login Successful" });
    } else {
        res.json({ success: false, message: "Invalid Email or Password" });
    }
});

// IMPORTANT: use Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});