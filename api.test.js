const request = require('supertest');
const knex = require('knex');
const app = require('./app'); // Import the app from app.js

// Set up the database connection
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './my_database.db', // Adjust this to your test database
  },
  useNullAsDefault: true,
});

describe('API Tests for /users, /users-posts/:userId, /create-post/:userId, /edit-post/:userId/:postId, /delete-post/:userId/:postId, /posts',  () => {
    // Cleanup before and after each test
    beforeEach(async () => {
      await db('posts').truncate();
      await db('users').truncate();
    });
  
    afterEach(async () => {
      await db('posts').truncate();
      await db('users').truncate();
    });
  
    // Test for /users
    describe('GET /users', () => {
      it('should return all users', async () => {
        await db('users').insert({ name: 'User One', mobile_number: '1234567890', post_count: 2 });
        await db('users').insert({ name: 'User Two', mobile_number: '0987654321', post_count: 1 });
  
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });
    });
  
    // Test for /users-posts/:userId
    describe('GET /users-posts/:userId', () => {
      it('should return posts for a user if user exists', async () => {
        const user = await db('users').insert({ name: 'User One', mobile_number: '1234567890', post_count: 2 }).returning('id');
        const userId = user[0].id;
  
        await db('posts').insert([
          { user_id: userId, title: 'Post 1', description: 'Post description 1', images: 'image1.jpg' },
          { user_id: userId, title: 'Post 2', description: 'Post description 2', images: 'image2.jpg' },
        ]);
  
        const response = await request(app).get(`/users-posts/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body.posts).toHaveLength(2);
      });
  
      it('should return 404 if user does not exist', async () => {
        const response = await request(app).get('/users-posts/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
      });
    });
  
    // Test for /create-post/:userId
    describe('POST /create-post/:userId', () => {
        // Cleanup before and after each test
        beforeEach(async () => {
          await db('posts').truncate();
          await db('users').truncate();
        });
      
        afterEach(async () => {
          await db('posts').truncate();
          await db('users').truncate();
        });
      
        it('should create a post for an existing user', async () => {
          // Insert a user into the database
          const user = await db('users').insert({ name: 'User One', mobile_number: '1234567890', post_count: 0 }).returning('id');
          const userId = user[0].id;
      
          // Prepare post data
          const postData = {
            title: 'New Post',
            description: 'Post description',
            images: ['image1.jpg', 'image2.jpg']
          };
      
          // Make the API call
          const response = await request(app)
            .post(`/create-post/${userId}`)
            .send(postData);
      
          // Assert that the response is correct
          expect(response.status).toBe(201);
          expect(response.body.message).toBe('Post created successfully');
        });
      
        it('should return 404 if user does not exist', async () => {
          // Prepare post data
          const postData = {
            title: 'New Post',
            description: 'Post description',
            images: ['image1.jpg', 'image2.jpg']
          };
      
          // Try to create a post for a non-existent user
          const response = await request(app)
            .post('/create-post/999') // Non-existent user ID
            .send(postData);
      
          // Assert that the response is correct
          expect(response.status).toBe(404);
          expect(response.body.error).toBe('User not found');
        });
      
        it('should return 400 if post data is missing or invalid', async () => {
          // Insert a user into the database
          const user = await db('users').insert({ name: 'User One', mobile_number: '1234567890', post_count: 0 }).returning('id');
          const userId = user[0].id;
      
          // Missing title in post data
          const response1 = await request(app)
            .post(`/create-post/${userId}`)
            .send({ description: 'Post description', images: ['image1.jpg'] });
          expect(response1.status).toBe(400);
          expect(response1.body.error).toBe('Invalid post data. Title, description, and images are required.');
      
          // Missing images array
          const response2 = await request(app)
            .post(`/create-post/${userId}`)
            .send({ title: 'New Post', description: 'Post description' });
          expect(response2.status).toBe(400);
          expect(response2.body.error).toBe('Invalid post data. Title, description, and images are required.');
      
          // Empty images array
          const response3 = await request(app)
            .post(`/create-post/${userId}`)
            .send({ title: 'New Post', description: 'Post description', images: [] });
          expect(response3.status).toBe(400);
          expect(response3.body.error).toBe('Invalid post data. Title, description, and images are required.');
        });
    });


    //Test for /edit-post/:userId/:postId 
    describe('PUT /edit-post/:userId/:postId', () => {
        let userId;
        let postId;
    
        beforeEach(async () => {
            // Setup: Insert a user into the database
            const user = await db('users').insert({
                name: 'Test User',
                mobile_number: '1234567890',
                post_count: 1,
            }).returning('id');
            userId = user[0].id;
    
            // Setup: Insert a post for the user
            const post = await db('posts').insert({
                title: 'Original Title',
                description: 'Original Description',
                user_id: userId,
                images: 'original-image.jpg',
            }).returning('id');
            postId = post[0].id;
        });
    
        afterEach(async () => {
            // Clean up the database after each test
            await db('posts').del();
            await db('users').del();
        });
    
        it('should update an existing post for a user', async () => {
            const updatedPost = {
                title: 'Updated Title',
                description: 'Updated Description',
                images: 'updated-image.jpg',
            };
    
            const response = await request(app)
                .put(`/edit-post/${userId}/${postId}`)
                .send(updatedPost);
    
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Post updated successfully!');
    
            // Verify the post in the database
            const post = await db('posts').where({ id: postId }).first();
            expect(post.title).toBe(updatedPost.title);
            expect(post.description).toBe(updatedPost.description);
            expect(post.images).toBe(updatedPost.images);
        });
    
        it('should return 404 if the post does not exist', async () => {
            const nonExistentPostId = 999; // Arbitrary non-existent post ID
            const response = await request(app)
                .put(`/edit-post/${userId}/${nonExistentPostId}`)
                .send({
                    title: 'Updated Title',
                    description: 'Updated Description',
                    images: 'updated-image.jpg',
                });
    
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Post not found for this user');
        });
    
        it('should return 404 if the user does not exist', async () => {
            const nonExistentUserId = 999; // Arbitrary non-existent user ID
            const response = await request(app)
                .put(`/edit-post/${nonExistentUserId}/${postId}`)
                .send({
                    title: 'Updated Title',
                    description: 'Updated Description',
                    images: 'updated-image.jpg',
                });
    
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Post not found for this user');
        });
    
        it('should return 500 if the update fails due to invalid data', async () => {
            const invalidData = {
                title: null, // Invalid title
                description: 'Updated Description',
                images: 'updated-image.jpg',
            };
    
            const response = await request(app)
                .put(`/edit-post/${userId}/${postId}`)
                .send(invalidData);
    
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to update the post');
        });
    });

    //Test for /delete-post/:userId/:postId 
    describe('DELETE /delete-post/:userId/:postId', () => {
        let userId;
        let postId;
      
        beforeAll(async () => {
          // Insert a user into the database
          const [user] = await db('users')
            .insert({
              name: 'Test User',
              mobile_number: '1234567890',
              post_count: 1,
            })
            .returning('*');
          userId = user.id;
      
          // Insert a post for the user
          const [post] = await db('posts')
            .insert({
              title: 'Test Title',
              description: 'Test Description',
              user_id: userId,
              images: 'test-image.jpg',
            })
            .returning('*');
          postId = post.id;
        });
      
        afterAll(async () => {
          // Clean up the database
          await db('posts').del();
          await db('users').del();
        });
      
        it('should return 404 if the post does not exist', async () => {
          const nonExistentPostId = 99999; // Arbitrary non-existent post ID
          const response = await request(app).delete(`/delete-post/${userId}/${nonExistentPostId}`);
      
          expect(response.status).toBe(404);
          expect(response.body.error).toBe('Post not found or does not belong to the user.');
        });
      
        it('should return 404 if the user does not exist', async () => {
          const nonExistentUserId = 99999; // Arbitrary non-existent user ID
          const response = await request(app).delete(`/delete-post/${nonExistentUserId}/${postId}`);
      
          expect(response.status).toBe(404);
          expect(response.body.error).toBe('Post not found or does not belong to the user.');
        });
       
        
      });
       
    // Test for /posts 
    describe('GET /posts', () => {
    it('should return all posts', async () => {
      await db('posts').insert({ title: 'Post about Nature', description: 'This is my post', user_id: 2, images: 'image_09.png' });
      await db('posts').insert({ title: 'Post about Sky', description: 'Sample Post', user_id: 1, images: 'image_89.png'});

      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
  });  
