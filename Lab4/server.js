const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient("mongodb://localhost:27017");
const app = express();
let sessions = {};

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
async function connectToDB() {
    await client.connect();
    console.log("Connected to MongoDB successfully");
    const db = client.db("testdb4");
    app.db = db;

    app.listen(8085, () => console.log("Server started"));
}

connectToDB();

// Auth Middleware
function auth(roles) {
    return function (req, res, next) {
        const sid = req.cookies.sid;
        if (sid && sessions[sid]) {
            const user = sessions[sid];
            if (roles && roles.includes(user.role)) {
                req.user = user;
                next();
            } else {
                res.status(401).send("You are not authorized");
            }
        } else {
            res.status(401).send("You are not authenticated");
        }
    };
}

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await app.db.collection("users").findOne({ username, password });
    if (user) {
        const sid = uuidv4();
        sessions[sid] = user;
        res.cookie("sid", sid, { httpOnly: true });
        res.json({ success: true, role: user.role, message: "Login successful" });
    } else {
        res.status(401).send("Username or password is incorrect");
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    const sid = req.cookies.sid;
    if (sid && sessions[sid]) {
        delete sessions[sid];
        res.clearCookie("sid");
    }
    res.send({ message: "Logged out successfully" });
});

// Home Route (for users)
app.get("/home", auth(["user", "admin"]), (req, res) => {
    res.send(`Welcome ${req.user.name} to Home`);
});

// Admin Dashboard Route (only for admins)
app.get("/admindata", auth(["admin"]), (req, res) => {
    res.send(`Welcome admin ${req.user.name} to Dashboard`);
});

// CRUD Routes for Users
app.get("/users", async (req, res) => {
    const users = await app.db.collection("users").find().toArray();
    res.send(users);
});

app.post("/users", async (req, res) => {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password || !role) {
        return res.status(400).send("All fields (name, username, password, role) are required");
    }
    const newUser = { name, username, password, role };
    const result = await app.db.collection("users").insertOne(newUser);
    res.send({ message: "User added successfully", result });
});

app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const result = await app.db.collection("users").findOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.put("/users/:id", async (req, res) => {
    const id = req.params.id;
    const { name, username, password, role } = req.body;
    const result = await app.db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, username, password, role } }
    );
    res.send({ message: "User updated successfully", result });
});

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    const result = await app.db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.send({ message: "User deleted successfully", result });
});