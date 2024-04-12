FocusNook Web Application - Backend System
==========================================

Overview:
---------
This document outlines the structure and setup for the backend system of the FocusNook web application. FocusNook aims to enhance productivity through a 
user-friendly interface that allows personalization of workspaces with themes and ambient sounds.

Instructions on Running the Project:
------------------------------------
1. Install Node.js and npm: Ensure that Node.js and npm are installed on your system. They are required to run the backend server and install dependencies.
2. Install Dependencies: Navigate to the backend directory in your terminal and run 'npm install' to install all the required dependencies.
3. Set Environment Variables: Set up the necessary environment variables for your development environment. This includes database connection strings like mongoURI, 
API keys like EMAIL_API_KEY and calendar's API_KEY, and other sensitive configurations.
5. Start the Server: Run 'npm start' to start the backend server within focusnook-backend. By default, the server will run on 
localhost with the port specified in the project settings 2000 for backend.

Development Platform:
---------------------
- Axios: A promise-based HTTP client for the browser and Node.js. It simplifies sending asynchronous HTTP requests to 
	REST endpoints and performing CRUD operations.
- Bcrypt: A library to help hash passwords. It is a secure way to store passwords in your database, considering that bcrypt automatically handles hashing.
- Body-parser: Middleware for parsing incoming request bodies in a middleware before your handlers, available under the `req.body` property. 
	It is used to parse JSON, Raw, Text, and URL-encoded form data.
- Cors: Middleware that can be used to enable Cross-Origin Resource Sharing (CORS) with various options. It allows or restricts requested resources 
	on a web server based on where the HTTP request was initiated.
- Express: A fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features to develop web and mobile applications and 
	facilitates the rapid development of Node-based web applications.
- Jsonwebtoken: An implementation of JSON Web Tokens. This allows you to securely transmit information between parties as a JSON object, making it easy 
	to implement authentication and information exchange.
- Mongodb: The official MongoDB driver for Node.js. It provides a high-level API on top of MongoDB's native drivers and allows you to connect to and work 
	with MongoDB databases from your Node.js application.
- Mongoose: A mongodb object modeling for Node.js. It provides a straight-forward, schema-based solution to model your application data. It includes built-in 
	type casting, validation, query building, and business logic hooks.
- Swagger-jsdoc: Integrates Swagger using JSDoc comments directly in your code. It allows you to document your APIs by annotating your code with JSDoc comments
	that can be transformed into a Swagger API spec.
- Swagger-ui-express: Middleware to serve the Swagger UI bound to your Swagger document. This allows you to serve auto-generated documentation of your API 
	defined with Swagger directly from express.
- Nodemon (devDependency): A utility that monitors for any changes in your source and automatically restarts your server. Perfect for development where you want 
	to save time and not have to manually restart your server.

File Structure:
---------------
- /express: Contains the modules for database connection and User/Task schema for collections. 
- /node_modules: Contains all the npm packages installed for the project.
- /express/app.js: The main entry point for the backend server. Where all the routes for connections are setup for user registration, task creation, calendar creation,
etc. All with unique endpoints /register, /profile/default-theme, /calendar/create, and many more.
- package.json: A file containing metadata about the project and lists the project dependencies.


