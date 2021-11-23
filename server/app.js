const express = require("express");
const path = require("path");
//deprecated
// const bodyParser = require("body-parser");

const userRoutes=require('./api/routes/users.routes');
const postRoutes=require('./api/routes/posts.routes');

const { sequelize } = require("./models/index");


const app = express();

sequelize
  .authenticate()
  .then(() => console.log("DB Connection Successful"))
  .catch(() => console.log("DB connection failed"));

// mongoose
//   .connect("mongodb://localhost:27017/NewApp")
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(() => {
//     console.log("Failed to connect database!");
//   });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.use("/images", express.static(path.join("./", "/resources/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
