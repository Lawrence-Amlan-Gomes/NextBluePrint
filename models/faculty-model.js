import mongoose, {Schema} from "mongoose";

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  initial: {
    required: true,
    type: String
  },
  photo: {
    required: false,
    type: String
  },
  department: {
    required: false,
    type: String
  },
  courses:{
    required: false,
    type: Array,
  }
});


export const facultyModel = mongoose.models.faculties ?? mongoose.model("faculties", schema);
