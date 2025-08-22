import { facultyModel } from "@/models/faculty-model";
import { userModel } from "@/models/user-model";

import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/utils/data-util";

async function getAllUsers() {
  const allUsers = await userModel.find().lean();
  return replaceMongoIdInArray(allUsers);
}

async function getAllFaculties() {
  const allfacultiess = await facultyModel.find().lean();
  return replaceMongoIdInArray(allfacultiess);
}

async function getFacultyComments(initial) {
  try {
    const faculty = await facultyModel.findOne({ initial: initial.toUpperCase() }, { comments: 1 }).lean();
    if (!faculty) {
      throw new Error(`Faculty with initial ${initial} not found`);
    }
    return faculty.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for faculty with initial ${initial}:`, error);
    throw error;
  }
}

async function getFacultyRatings(initial) {
  try {
    const faculty = await facultyModel.findOne({ initial: initial.toUpperCase() }, { stars: 1 }).lean();
    if (!faculty) {
      throw new Error(`Faculty with initial ${initial} not found`);
    }
    return faculty.stars || []; // Fixed: Return stars instead of comments
  } catch (error) {
    console.error(`Error fetching ratings for faculty with initial ${initial}:`, error);
    throw error;
  }
}

async function createUser(user) {
  return await userModel.create(user);
}

async function createFaculty(user) {
  return await facultyModel.create(user);
}

async function deleteFaculty(initial) {
  const result = await facultyModel.deleteOne({ initial: initial });
  return result.deletedCount > 0; // Returns true if deletion was successful
}

async function findUserByCredentials(credentials) {
  const user = await userModel.findOne(credentials).lean();
  if (user) {
    return replaceMongoIdInObject(user);
  }
  return null;
}

async function updateUser(email, name, department, serial) {
  await userModel.updateOne(
    { email: email },
    { $set: { name: name, department: department, serial: serial } }
  );
}

async function updateUserComment(email, comment) {
  await userModel.updateOne({ email: email }, { $set: { comment: comment } });
}

async function updateFaculty(initial, name, department, courses, photo) {
  await facultyModel.updateOne(
    { initial: initial },
    { $set: { name: name, department: department, courses: courses, photo: photo } }
  );
}

async function changePassword(email, password) {
  await userModel.updateOne({ email: email }, { $set: { password: password } });
}

async function upDateDays(email, days) {
  await userModel.updateOne({ email: email }, { $set: { days: days } });
}

async function changePhoto(email, photo) {
  await userModel.updateOne({ email: email }, { $set: { photo: photo } });
}

async function changeCommentsFaculty(initial, comments) {
  await facultyModel.updateOne(
    { initial: initial },
    { $set: { comments: comments } }
  );
}

async function changeRatingsFaculty(initial, stars) {
  await facultyModel.updateOne(
    { initial: initial },
    { $set: { stars: stars } }
  );
}

export {
  changePassword,
  changePhoto,
  changeCommentsFaculty,
  changeRatingsFaculty,
  createFaculty,
  createUser,
  deleteFaculty,
  findUserByCredentials,
  getAllFaculties,
  getAllUsers,
  upDateDays,
  updateFaculty,
  updateUser,
  updateUserComment,
  getFacultyComments,
  getFacultyRatings,
};