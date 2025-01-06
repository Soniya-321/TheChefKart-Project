const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('my_database.db');


// Try inserting another user with the same mobile number (to test uniqueness)
db.run(`
    INSERT INTO users (name, mobile_number, address)
    VALUES (?, ?, ?)
`, ['Elon Warrior', '0987654657', '123 Banjara Hills'], (err) => {
    if (err) {
        console.error('Expected error due to duplicate mobile number:', err.message);
    }
});



