//Initialising Express Router
const Router = require("express").Router();

//Database Models
const PublicationModel = require("../../database/publications");

/*
Route           /publication
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET

*/

Router.get("/", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({publications: getAllPublications});
});

/*
Route           /publication/book/:isbn
Description     get specific publication based on isbn
Access          PUBLIC
Parameters      isbn
Method          GET

*/

Router.get("/book/:isbn", async (req,res) => {
    const getSpecificPublication = await PublicationModel.find(
        {books: req.params.isbn}); 

    if(!getSpecificPublication) {
        return res.json({error: `No publication found for this book 
        ${req.params.isbn}`});
    }
    return res.json({PublicationByISBN: getSpecificPublication});
});


/*
Route           /publication/:id
Description     get specific publication based on id
Access          PUBLIC
Parameters      id
Method          GET

*/

Router.get("/:id", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne(
        {id: req.params.id}); 

    if(!getSpecificPublication) {
        return res.json({error: `No publication found having id
        ${req.params.id}`});
    }
    return res.json({Publication: getSpecificPublication});
});

/*
Route           /publication/new
Description     Add new Publication
Access          PUBLIC
Parameters      NONE
Method          POST

*/

Router.post("/new", async (req,res) =>
{
    const { newPublication } = req.body;

    const addNewPublication = PublicationModel.create(newPublication);

    return res.json({publications : addNewPublication, message: "publication was added!!"});
});

/*
Route           /publication/update/:id
Description     Update publication name using id
Access          PUBLIC
Parameters      id
Method          PUT

*/

Router.put("/update/:id", async (req,res) =>
{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: req.body.publicationName
        },
        {
            new: true
        }
    );

    return res.json({Publications: updatedPublication});
});

/*
Route           /publication/books/update/:isbn
Description     Update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT

*/

Router.put("/books/update/:isbn", async (req,res) =>
{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.pubID
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication: req.body.pubID
        },
        {
            new: true
        }
    );

    return res.json({books: updatedBook, 
        publications: updatedPublication,
        message: "Successfully updated publication!!"
    });
});

/*
Route           /publication/delete/books/:isbn/:pubid
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn, publicationid
Method          DELETE

*/

Router.delete("/delete/books/:isbn/:pubid", async (req,res) => 
{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.pubid
        },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        {
            new:  true
        }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication: 0
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook, 
        publications: updatedPublication,
        message: "Publication was deleted!!"});
});

/*
Route           /publication/delete/:id
Description     delete an author
Access          PUBLIC
Parameters      id
Method          DELETE

*/

Router.delete("/delete/:id", async (req,res) => 
{
    const updatedPublicationDatabase =await PublicationModel.findOneAndDelete(
        {
            id: parseInt(req.params.id)
        });

    return res.json({publications: updatedPublicationDatabase});
});

module.exports = Router;