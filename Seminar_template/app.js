// book.routes.js

// TODO: Import Express and create a new express app.

// TODO: Import the Book model defined in the model folder.

// TODO: Define a GET /books route on the router that:
//       - uses a Sequelize "read" method to get all books based on one or more filters
//       - returns them as JSON with a suitable HTTP status code
//       - handles errors 

// TODO: Define a GET /books/:id route that:
//       - reads the id from the route params
//       - uses a Sequelize method to find a book by its primary key
//       - returns 404 if not found, or the book as JSON if found
//       - handles errors.

// TODO: Define a POST /books route that:
//       - reads data from req.body
//       - uses a Sequelize "create" method to insert a new book
//       - returns the created book with a 201 status code
//       - handles validation/errors.

// TODO: Define a PUT /books/:id route that:
//       - reads the id from params and data from body
//       - uses Sequelize "update" logic
//       - returns 404 if the book does not exist
//       - returns the updated book as JSON if it does
//       - handles errors.

// TODO: Define a DELETE /books/:id route that:
//       - reads the id from params
//       - uses Sequelize "delete" logic to remove the book
//       - returns 404 if nothing was deleted
//       - returns an appropriate status (e.g. 204) if successful
//       - handles errors.

// TODO: Refactor the app so it respects the organizing rules of web projects
