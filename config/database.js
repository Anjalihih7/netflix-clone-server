const { mongoose } = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URL).then((res) => {
    console.log(`Database connected successfully ${res.connection.host}`);
  });
};

module.exports = connectDB;
