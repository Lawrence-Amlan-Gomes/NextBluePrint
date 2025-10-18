import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: false,
    type: String,
  },
  photo: {
    required: false,
    type: String,
  },
  paymentType: {
    required: false,
    type: String,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
  firstTimeLogin: {
    type: Boolean,
    required: false,
  },
});

export const userModel =
  mongoose.models.users ?? mongoose.model("users", schema);
