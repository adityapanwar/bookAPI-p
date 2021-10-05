require("dotenv").config();
const express=require("express");
const mongoose = require("mongoose");

//Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publications");

//Initializing express
const shapeAI = express();

//Configurations
shapeAI.use(express.json());


//Establish database connection
mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("Connection Established!!"));

//Initialising MicroServices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);

shapeAI.listen(3000, () => console.log("Server running!!"));