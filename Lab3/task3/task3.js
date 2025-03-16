const express = require("express");
const EventEmitter = require("events");

const app = express();
const eventEmitter = new EventEmitter();


eventEmitter.on("requestReceived", (data) => {
    console.log(`New Event: ${data}`);
});


app.use((req, res, next) => {
    eventEmitter.emit("requestReceived", `Request ${req.method} on ${req.url}`);
    next();
});

app.get("/", (req, res) => res.send("Welcome to our home page!"));

app.listen(8082)
