//Initialising Express Router
const Router = require("express").Router();

//Database Models
const BookModel = require("../../database/books");

/*
Route           /book/
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({books: getAllBooks});
});

/*
Route           /book/is/:ISBN
Description     get specific book based on ISBN
Access          PUBLIC
Parameters      ISBN
Method          GET

*/

Router.get("/is/:ISBN", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.ISBN});

    if(!getSpecificBook) {
        return res.json({error: `No book found for the ISBN of
         ${req.params.ISBN}`});
    }
    return res.json({BookByISBN: getSpecificBook});
});

/*
Route           /book/c/:category
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET

*/

Router.get("/c/:category", async (req,res) => {
    const getSpecificBooks = await BookModel.find({
        Category: req.params.category});
    
        if(!getSpecificBooks) {
            return res.json({error: `No book found for the category
             of ${req.params.category}`});
        }
        return res.json({BooksByCategory: getSpecificBooks});
    });
    
    /*
    Route           /book/author/:id
    Description     get specific books based on an author
    Access          PUBLIC
    Parameters      id
    Method          GET
    
*/
    
Router.get("/author/:id", async (req,res) => {
    const BookList = await BookModel.find({
        authors: req.params.id});
    
        if(!BookList) {
            return res.json({error: `No book found for the author
                of id ${req.params.id}`});
        }
        return res.json({BooksByAuthor: BookList});
    });
    
/*
Route           /book/new
Description     Add new Book
Access          PUBLIC
Parameters      NONE
Method          POST

*/

Router.post("/new", async (req,res) =>
{
    //exception handling by express to handle validation error by mongoose
    try{
        const { newBook } = req.body;

        const addNewBook = await BookModel.create(newBook);

        return res.json({books : addNewBook, message: "book was added!!"});

    } catch(error){
        return res.json({error: error.message});
    }
});

/*
Route           /book/update/:isbn
Description     Update book title
Access          PUBLIC
Parameters      isbn
Method          PUT

*/

Router.put("/update/:isbn", async (req,res) =>
{
    try{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true //to display the new data on postman
        }
    );

    return res.json({books: updatedBook});
    }catch(error){
        return res.json({error: error.message});        
    }
});

/*
Route           /book/author/:isbn
Description     Update/Add new Author
Access          PUBLIC
Parameters      isbn
Method          PUT

*/

Router.put("/author/:isbn", async (req,res) =>
{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
            authors: req.body.newAuthor
            }
        },
        {
            new: true 
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
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

    return res.json({books: updatedBook, authors: updatedAuthor, message: "New Author was added"});
});

/*
Route           /book/delete/:isbn
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

Router.delete("/delete/:isbn", async (req,res) => 
{
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        });
    return res.json({books: updatedBookDatabase});
});

/*
Route           /book/author/delete/:isbn/authorid
Description     delete an author from book
Access          PUBLIC
Parameters      isbn, authorid
Method          DELETE    
*/

Router.delete("/author/delete/:isbn/authorid", async (req,res) => 
{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                authors: parseInt(req.params.authorid)
            }
        },
        {
            new: true
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorid)
        },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json(
        {
            books: updatedBook,
            authors: updatedAuthor,
            message: "Author was deleted!!"
        }
    );
});

module.exports = Router;