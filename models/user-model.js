import mongoose, {Schema} from "mongoose";

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  phone: {
    required: false,
    type: String
  },
  photo: {
    required: false,
    type: String
  },
  bio: {
    required: false,
    type: String
  },
  paymentType: {
    required: false,
    type: String
  },
  comment: {
    required: false,
    type: Array
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: false
  },
  absenceFaculty:{
    type: String,
    required: false
  }
  
});


export const userModel = mongoose.models.users ?? mongoose.model("users", schema);
