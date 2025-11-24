// 1. Import the following from 'sequelize':
//    - Model
//    - DataTypes

// 2. Import the sequelize instance from './db' (or the correct relative path).

// 3. Create a Book class that extends Model.

// 4. Call Book.init(...) to define the fields/columns for the "books" table.
//    Suggested fields:
//    - id: INTEGER, primaryKey, autoIncrement, not null
//    - title: STRING, not null
//    - author: STRING, not null
//    - year: INTEGER, can be null

// 5. In the Book.init options object, set at least:
//    - sequelize: (the sequelize instance you imported)
//    - modelName: 'Book'
//    - tableName: 'books'
//    - timestamps: true  (so you get createdAt and updatedAt)


export async function seedBooks() {
    try {
        // Optional: avoid seeding twice
        const count = await Book.count();
        if (count > 0) {
            console.log("Seed skipped: books already exist.");
            return;
        }

        await Book.bulkCreate(
            [
                {
                    title: "Clean Code",
                    author: "Robert C. Martin",
                    year: 2008,
                },
                {
                    title: "The Pragmatic Programmer",
                    author: "Andrew Hunt, David Thomas",
                    year: 1999,
                },
                {
                    title: "You Don't Know JS Yet",
                    author: "Kyle Simpson",
                    year: 2020,
                },
                {
                    title: "Refactoring",
                    author: "Martin Fowler",
                    year: 1999,
                },
            ],
            { validate: true }
        );

        console.log("Books seeded successfully.");
    } catch (err) {
        console.error("Error seeding books:", err);
    }
}

// 6. Export the Book model so you can use it in other files
