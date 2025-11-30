// 1. Import the Sequelize class from the 'sequelize' package.
import { Sequelize } from "sequelize";
// 2. Create a new Sequelize instance that:
//    - uses the 'sqlite' dialect
//    - uses a storage file named something like 'books.sqlite' (or 'books.db')

const db = new Sequelize({
    dialect: "sqlite",
    storage: 'books.db'
})

// 3. Create an async function that tests the connection and created the tables
// and logs each operation

async function syncDb() {
    try {
        await db.authenticate()
        console.log("Connection ok");
        await db.sync({ alter: true });
        console.log("Tables synchronized")
    } catch (err) {
        console.log("Error:", err)
    }

}

// 4. Export the Sequelize instance and function
//    so it can be used in other files (like the Book model).

export {
    db,
    syncDb
}