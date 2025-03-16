const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const logFile = path.join(__dirname, "log.txt");


app.use((req, res, next) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

    fs.appendFile(logFile, log, (err) => {
        if (err) console.error("Error:", err);
    });

    next();
});

app.get("/logs", (req, res) => {
    fs.readFile(logFile, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading log file");
        res.send(`<p>${data}</p>`);
    });
});

app.listen(8082)
