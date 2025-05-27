const mongoose = require("mongoose");

const connectDb = async (url) => {
  await mongoose
    .connect(url)
    .then(() => console.log("MongoDb connected"))
    .catch((error) => console.log(error));
};

module.exports = { connectDb };
