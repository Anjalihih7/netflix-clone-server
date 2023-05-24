const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
app.use(express.json());
const cache = require("./routeCache");

const user = require("./routes/UserRoutes");
app.use("/api/v1/user", user);

//Middlware for error
//( This default error-handling middleware function is added at the end of the middleware function stack.)
app.use(errorMiddleware);

module.exports = app;
