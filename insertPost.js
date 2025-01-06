const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my_database.db'); // Ensure the correct database path

function addPost(title, description, userId, images) {
    db.serialize(() => {
        // Step 1: Check if the user exists
        db.get(`SELECT id FROM users WHERE id = ?`, [userId], (err, row) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                return;
            }
            if (!row) {
                console.error(`User with ID ${userId} does not exist.`);
                return;
            }

            // Step 2: Insert the post into the posts table
            db.run(
                `INSERT INTO posts (title, description, user_id, images) VALUES (?, ?, ?, ?)`,
                [title, description, userId, images],
                function (err) {
                    if (err) {
                        console.error('Error inserting post:', err.message);
                        return;
                    }
                    console.log('Post added successfully with ID:', this.lastID);

                    // Step 3: Update the post_count in the users table
                    db.run(
                        `UPDATE users SET post_count = post_count + 1 WHERE id = ?`,
                        [userId],
                        function (err) {
                            if (err) {
                                console.error('Error updating post count:', err.message);
                                return;
                            }
                            console.log('User post count updated successfully.');
                        }
                    );
                }
            );
        });
    });
}

// Example Usage
addPost(
    'Sample Post', 
    'This is a sample post description.', 
    1, 
    'image1.png,image2.jpg'
);

// Close the database connection when done
process.on('exit', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
