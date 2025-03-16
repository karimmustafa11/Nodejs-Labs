const express = require("express");
const app = express();

app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to our home page!");
});

app.get("/about", (req, res) => {
    res.send("Welcome to our about page!");
});

app.listen(8082)
