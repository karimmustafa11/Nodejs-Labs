const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());


//array to store cars
let cars = [];

//show all cars
app.get('/cars', (req, res) => {
    res.json(cars);
});

//add a car
app.post('/addCar', (req, res) => {
    cars.push(req.body);
    res.send({ msg: "car added successfully" });
});

//delete a car
app.get("/deleteCar", function (req, res) {
    const id = req.query.id;
    const index = cars.findIndex(x => x.id == id);
    if (index > -1) {
        cars.splice(index, 1);
        res.send({ msg: "Car deleted" });
    } else {
        res.send({ msg: "no Car found with this id " + id });
    }
})

app.post("/editCar", function (req, res) {
    const { id, name, type, color } = req.body;
    const index = cars.findIndex(x => x.id === id);

    if (index > -1) {
        if (name) cars[index].name = name;
        if (type) cars[index].type = type;
        if (color) cars[index].color = color;

        res.send({ msg: "Car edited"});
    } else {
        res.status(404).send({ msg: "No car found with this ID"});
    }
});



app.get("/", function (req, res) {
    res.sendFile(__dirname + "/cars.html")
})

app.listen(8082)

