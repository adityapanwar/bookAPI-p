//Initialising Express Router
const Router = require("express").Router();

//Database Models
const AuthorModel = require("../../database/authors");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors});
});

/*
Route           /author/:id
Description     get specific author based on id
Access          PUBLIC
Parameters      id
Method          GET

*/

Router.get("/:id", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne(
        {id: req.params.id});

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for the id of
         ${req.params.id}`});
    }
    return res.json({AuthorByID: getSpecificAuthor});
});

/*
Route           /author/book/:isbn
Description     get specific authors based on isbn
Access          PUBLIC
Parameters      isbn
Method          GET

*/

Router.get("/book/:isbn", async (req,res) => {
    const getSpecificAuthors = await AuthorModel.find(
        {books: req.params.isbn});

    if(!getSpecificAuthors) {
        return res.json({error: `No author found for this book 
        ${req.params.isbn}`});
    }
    return res.json({AuthorsByISBN: getSpecificAuthors});
});

/*
Route           /author/new
Description     Add new Author
Access          PUBLIC
Parameters      NONE
Method          POST

*/

Router.post("/new", async (req,res) =>
{
    const { newAuthor } = req.body;

    const addNewAuthor = AuthorModel.create(newAuthor);

    return res.json({authors : addNewAuthor, message: "author was added!!"});
});


/*
Route           /author/update/:id
Description     Update author name using id
Access          PUBLIC
Parameters      id
Method          PUT
*/

Router.put("/update/:id", async (req,res) =>
{
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: req.body.authorName
        },
        {
            new: true
        }
    );

    return res.json({authors: updatedAuthor});
});




/*
Route           /author/delete/:id
Description     delete an author
Access          PUBLIC
Parameters      id
Method          DELETE

*/

Router.delete("/delete/:id", async (req,res) => 
{
    const updatedAuthorDatabase =await AuthorModel.findOneAndDelete(
        {id: parseInt(req.params.id)});

    return res.json({authors: updatedAuthorDatabase});
});

module.exports = Router;