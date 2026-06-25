const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "users.json";

app.get("/", (req, res) => {
    res.send("TradeHistoryPro Server Running");
});

app.post("/signup", (req, res) => {
    const users = JSON.parse(fs.readFileSync(FILE));

    users.push(req.body);

    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

    res.json({
        success: true,
        message: "Account Created Successfully"
    });
});

app.post("/login", (req, res) => {
    const users = JSON.parse(fs.readFileSync(FILE));

    const user = users.find(
        u =>
        u.email === req.body.email &&
        u.password === req.body.password
    );

    if(user){
        res.json({
            success:true,
            message:"Login Successful"
        });
    }else{
        res.json({
            success:false,
            message:"Invalid Email or Password"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});