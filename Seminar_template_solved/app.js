// TODO: Import Express and create a new express app.
// TODO: Import the Book model defined in the model folder.
import { Book, seedBooks } from "./model/book.js";
import { syncDb } from "./config.js";
import express from "express";
import { Op } from "sequelize";

const app = express();
const PORT = 8080;

app.use(express.json());

// TODO: Define a GET /books route on the router that:
//       - uses a Sequelize "read" method to get all books based on a filter
//       - returns them as JSON with a suitable HTTP status code
//       - handles errors 

app.get("/books", async (req, res) => {
    try {
        const query = req.query;
        delete query.id;

        const columns = Object.keys(Book.getAttributes());

        const whereCondition = Object.keys(query)
            .filter(key => columns.includes(key))
            .map(key => {
                if (key === "title" || key === "author") {
                    return { [key]: { [Op.like]: query[key] } }
                }

                return { [key]: query[key] }
            })

        const books = await Book.findAll(
            {
                attributes: ["title", "author", "year"],
                where: whereCondition
            }
        )

        res.status(200).json(books)

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// TODO: Define a GET /books/:id route that:
//       - reads the id from the route params
//       - uses a Sequelize method to find a book by its primary key
//       - returns 404 if not found, or the book as JSON if found
//       - handles errors.

app.get("/books/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// TODO: Define a POST /books route that:
//       - reads data from req.body
//       - uses a Sequelize "create" method to insert a new book
//       - returns the created book with a 201 status code
//       - handles validation/errors.

app.post("/books", async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        return res.status(201).json(newBook);
    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                error: "Validation error",
                details: err.errors.map(e => e.message),
            });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }

})

// TODO: Define a PUT /books/:id route that:
//       - reads the id from params and data from body
//       - uses Sequelize "update" logic
//       - returns 404 if the book does not exist
//       - returns the updated book as JSON if it does
//       - handles errors.

app.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = req.body;
        const oldBook = await Book.findByPk(req.params.id);
        if (oldBook) {
            oldBook.set(updatedBook);
            await oldBook.save();
        }
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

// TODO: Define a DELETE /books/:id route that:
//       - reads the id from params
//       - uses Sequelize "delete" logic to remove the book
//       - returns 404 if nothing was deleted
//       - returns an appropriate status (e.g. 204) if successful
//       - handles errors.

app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOne({
            where: { id: req.params.id }
        })

        await book.destroy();
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

async function start() {
    try {
        // Make sure DB is ready *before* we start listening
        await syncDb();
        await seedBooks();
        app.listen(PORT, () => {
            console.log("Server is listening on port", PORT);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
}

start();
// TODO: Refactor the app so it respects the organizing rules of web projects
