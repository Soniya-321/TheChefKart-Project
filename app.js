const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');

// Initialize the Knex instance for SQLite
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './my_database.db', // Path to your database
  },
  useNullAsDefault: true,
});

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(express.json());


// Start the server
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Route to get all posts for a given user
app.get('/users-posts/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all posts for the given user
    const posts = await db('posts').where({ user_id: userId });

    // If the user exists but has no posts
    if (posts.length === 0) {
      return res.status(200).json([]);  // Return an empty array if no posts found
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        mobile_number: user.mobile_number,
        post_count: user.post_count,
      },
      posts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching posts.' });
  }
}); 


// Create a new Post for the specified users 
app.post('/create-post/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { title, description, images } = req.body;
  console.log(userId);
  console.log('Request body:', req.body);

  try {
   /* if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Invalid post data. Title, description, and images are required.' });
    } */

    // Check if user exists in the database
    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new post
    await db('posts').insert({
      title,
      description,
      user_id: userId,
      images
    });

    // Increment the post count for the user
    await db('users').where({ id: userId }).increment('post_count', 1);

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});



// Edit a post API
app.put('/edit-post/:userId/:postId', async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  const { title, description, images } = req.body;
  console.log(userId, postId);
  // Log the request body to verify the input
  console.log('Request body:', req.body);

  // Validate if post exists
  const post = await db('posts').where({ id: postId, user_id: userId }).first();
  if (!post) {
    return res.status(404).json({ error: 'Post not found for this user' });
  }

  // Update post details
  try {
    await db('posts')
      .where({ id: postId })
      .update({
        title,
        description,
        images,
      });

    // Send response back after successful update
    return res.status(200).json({ message: 'Post updated successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update the post' });
  }
});



// API to delete a post of a user
app.delete('/delete-post/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;
  console.log(userId, postId);
  try {
    // Check if the post exists
    const post = await db('posts').where({ id: postId, user_id: userId }).first();

    if (!post) {
      return res.status(404).json({ error: 'Post not found or does not belong to the user.' });
    }

    // Delete the post
    await db('posts').where({ id: postId, user_id: userId }).del();

    // Decrement the user's post count
    const updatedCount = await db('users')
      .where({ id: userId })
      .decrement('post_count', 1);
    if (updatedCount === 0) {
      throw new Error('Failed to update user post count.');
    }

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post.' });
  }
});


// API to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db('users').select('*'); // Fetch all users
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving users.' });
  }
});


// API to get all posts 
app.get('/posts', async (req, res) => {
  try {
    const posts = await db('posts').select('*'); // Fetch all posts
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.json(posts);
  }
  catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'An error occurred while retrieving posts.' });
  }
}); 


module.exports = app;