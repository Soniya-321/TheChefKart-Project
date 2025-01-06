# Project Name: Micro Instagram

## Overview
This API allows users to manage posts, including creating, reading, updating, and deleting posts. It also includes endpoints for user details and managing relationships between users and their posts.

---

## **Setup Instructions**

### **1. Prerequisites**
- **Node.js** (v14 or higher) and **npm** installed on your machine.
- A database (e.g., Sqlite, MySQL, PostgreSQL, or MongoDB).
- A tool like **Postman** or **cURL** for API testing.

### **2. Clone the Repository**
```bash
$ git clone <repository-url>
$ cd <project-directory>
```

### **3. Install Dependencies**
```bash
$ npm install
```

### **4. Configure Environment Variables**
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3004
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=post_management
JWT_SECRET=your-secret-key
```

### **5. Database Setup**
1. Create a new database named `my_database.db`.
2. Run the migrations or SQL script provided in the `/migrations` directory.
3. Optionally, seed the database with sample data using the seed script:
   ```bash
   $ npm run seed
   ```

### **6. Start the Server**
```bash
$ npm start
```
The server will be running on `http://localhost:3004`.

---

## **How to Run Tests**

### **Unit and Integration Tests**
- Ensure the test database is set up with the same schema as the production database.
- Run the tests using:
  ```bash
  $ npm test
  ```
- View the coverage report in the `coverage` directory after tests complete.

---

## **API Documentation**

### **Base URL**: `http://localhost:3004`

### **Endpoints**

#### **1. Create Post**
- **URL**: `/create-post/:userId`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Post Title",
    "description": "Post Description",
    "images": "image.jpg"
  }
  ```
- **Response**:
  - Success (201): Post created successfully.
  - Error (400/500): Validation or server error.

#### **2. Delete Post**
- **URL**: `/delete-post/:userId/:postId`
- **Method**: `DELETE`
- **Response**:
  - Success (200): Post deleted successfully.
  - Error (404/500): Post not found or server error.

#### **3. Get All Posts**
- **URL**: `/posts`
- **Method**: `GET`
- **Response**:
  - Success (200): List of posts.
  - Error (500): Server error.

#### **4. Get Posts by userID**
- **URL**: `/users-posts/:userId`
- **Method**: `GET`
- **Response**:
  - Success (200): Details of the all posts for specified users.
  - Error (404/500): Post not found or server error.

#### **5. Update Post**
- **URL**: `/edit-post/:userId/:postId`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "images": "updated-image.jpg"
  }
  ```
- **Response**:
  - Success (200): Post updated successfully.
  - Error (404/500): Post not found or server error.

#### **6. Get User Details**
- **URL**: `/users/`
- **Method**: `GET`
- **Response**:
  - Success (200): All User details.
  - Error (404/500): User not found or server error.

---

## **Deployment Instructions**

### **1. Prerequisites**
- A cloud hosting platform (e.g., AWS, Heroku, DigitalOcean, Vercel).
- A production database.
- An SSH key or necessary credentials for the hosting platform.

### **2. Build for Production**
```bash
$ npm run build
```

### **3. Upload Files to the Server**
- Use an FTP tool or Git to upload the files to the server.

### **4. Install Dependencies on Server**
```bash
$ npm install --production
```

### **5. Configure Environment Variables on Server**
Use the hosting platform’s environment configuration tool to set the `.env` variables as in development.

### **6. Start the Application**
- Use a process manager like **PM2**:
  ```bash
  $ npm install -g pm2
  $ pm2 start server.js --name post-management-api
  ```

### **7. Monitor and Logs**
- Monitor the application using PM2:
  ```bash
  $ pm2 logs post-management-api
  ```

---

## **Replication Steps**

1. Clone the repository.
2. Follow the setup instructions for dependencies, database, and environment variables.
3. Run the server locally and test endpoints using Postman.
4. For production, deploy using the deployment instructions provided above.

---
