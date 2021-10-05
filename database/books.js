const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 10
    }, //mongoose validation
    title: {
      type: String,
      required: true
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    Category: [String],
    publication: Number
});

//Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;