const app = require("./app");
const connectDB = require("./config/database");
require("dotenv").config({ path: "./config/config.env" });
const cors = require("cors");
app.use(cors());

process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log("Shutting Down The Server Due To  Uncaught Exception");
  // process.exit(1);   //for stop the server
});

//connect Database
connectDB();

// console.log(youtube); //check uncaughtException error

const server = app.listen(process.env.PORT, () => {
  console.log(`PORT is running on ${process.env.PORT}`);
});

//For handle warnnigs
process.on("warning", (warning) => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});

// if mongodb password is wrong or we give wrong variable name etc.. then this error happens
process.on("unhandledRejection", (err) => {
  console.log(`Shutting Down The Server Due To ${err.name}: ${err.message} `);
  server.close(() => {
    process.exit(1);
  });
});
