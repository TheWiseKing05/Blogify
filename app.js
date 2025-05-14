require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const app = express();

const PORT = process.env.PORT || 8000;

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect(process.env.MONGO_URI)
  .then((e) => console.log("MongoDB connected"));

// Setting EJS, or Embedded JavaScript - simple templating language that allows you to generate HTML with plain JavaScript
// Set the view engine to use EJS
app.set("view engine", "ejs");

// Take data from views which is in current directory
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")));
app.use(express.static("public"));
// Handle GET requests to the root URL
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
