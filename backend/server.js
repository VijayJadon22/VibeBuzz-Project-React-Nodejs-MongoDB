import path from "path";
import express from "express"; // Importing the Express library to create a web server
import dotenv from "dotenv"; // Importing the dotenv library to load environment variables from a .env file
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectMongoDB from "./db/connectMongoDB.js"; // Importing the function to connect to MongoDB

import authRoutes from "./routes/auth.routes.js"; // Importing the authentication routes
import userRoutes from "./routes/user.routes.js"; // Importing the user routes
import postRoutes from "./routes/post.routes.js"; // Importing the post routes
import notificationRoutes from "./routes/notification.routes.js"; // Importing the notification routes


dotenv.config(); // Loading environment variables from the .env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express(); // Creating an instance of the Express application
const PORT = process.env.PORT || 5000; // Defining the port number to listen on, using the value from the environment variable or 5000 as default
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // Middleware to parse incoming JSON requests
//keep limit uptil 5mb only otherwise server might crash due to denial of service (dos)
app.use(express.urlencoded({ extended: true })); // Middleware to parse incoming URL-encoded requests

app.use(cookieParser());

app.use("/api/auth", authRoutes); // Setting up the authentication routes with the base URL "/api/auth"
app.use("/api/users", userRoutes); // Setting up the user routes with the base URL "/api/users"
app.use("/api/posts", postRoutes); // Setting up the post routes with the base URL "/api/posts"
app.use("/api/notifications", notificationRoutes); //Setting up the notfication routes with the base URL "/api/notifications"

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}

// Starting the server and listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`); // Logging the server start message
    connectMongoDB(); // Connecting to MongoDB when the server starts
});
