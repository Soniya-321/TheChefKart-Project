const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create if it doesn't exist)
const db = new sqlite3.Database('my_database.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create a 'users' table
db.serialize(() => {
    db.run(`
        DROP TABLE IF EXISTS users; -- Drop the table if it exists
    `);

    db.run(`
        DROP TABLE IF EXISTS posts; -- Drop the table if it exists
    `);

    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Auto-incrementing ID
            name TEXT NOT NULL,                     -- User name
            mobile_number TEXT UNIQUE NOT NULL,     -- Mobile number (must be unique)
            address TEXT,                           -- Address (optional)
            post_count INTEGER DEFAULT 0           -- Initialize post count to 0
        );
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Table "users" created successfully.');
        }
    });

    // Create the posts table
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Auto-incrementing ID
            title TEXT NOT NULL,                   -- Post title
            description TEXT NOT NULL,             -- Post description
            user_id INTEGER NOT NULL,              -- Foreign key referencing users
            images TEXT,                           -- Image paths (comma-separated or JSON)
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `, (err) => {
        if (err) {
            console.error('Error creating posts table:', err.message);
        } else {
            console.log('Table "posts" created successfully.');
        }
    });

});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});

module.exports = db;
