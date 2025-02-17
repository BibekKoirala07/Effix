const mongoose = require("mongoose");

exports.connectDB = async () => {
  console.log("process", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.log("MongoDb Not connected!!!");
    console.log(err);
  }
};
