const mongoose = require("mongoose");
// import mongose from "mongoose"
require("dotenv").config();

dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect is okkkk!");
  } catch (error) {
    console.log("Unable to Connect!!");
    console.log(error);
  }
};

module.exports = dbConnect;

