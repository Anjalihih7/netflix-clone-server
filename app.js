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
    optionSuccessStatus: 200,
  })
);

//for cross-origin-issue
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  //res.setHeader("Access-Control-Allow-Origin", "https://progresshacker.com");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // res.setHeader("Access-Control-Allow-Headers: Content-Type, *");  //new add
  // res.header("Set-Cookie:token; SameSite=None");  //chng
  // res.header("Set-Cookie: token; SameSite=None");
  next();
});

const user = require("./routes/UserRoutes");

app.get("/", (req, res) => {
  res.send("<h3> Server Runs Successfully </h3>");
});

app.use("/api/v1/user", user);

//Middlware for error
//( This default error-handling middleware function is added at the end of the middleware function stack.)
app.use(errorMiddleware);

module.exports = app;
