const mongoose = require("mongoose");

//Creating a author schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//Create a author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;