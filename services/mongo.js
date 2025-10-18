import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING
    );
    console.log("Connected");
    return conn;
  } catch (err) {
    console.log(err);
  }
}
