const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
app.use(express.json());
const cache = require("./routeCache");
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const user = require("./routes/UserRoutes");

app.get("/", (req, res) => {
  res.send("<h3> Server Runs Successfully </h3>");
});

app.use("/api/v1/user", user);

//Middlware for error
//( This default error-handling middleware function is added at the end of the middleware function stack.)
app.use(errorMiddleware);

module.exports = app;
