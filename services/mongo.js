import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://amlangomes:AmlanMongoDBAtlas@lag.xgj6efw.mongodb.net/facultyReview"
    );
    console.log("Connected");
    return conn;
  } catch (err) {
    console.log(err);
  }
}
