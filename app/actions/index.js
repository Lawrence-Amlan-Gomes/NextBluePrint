"use server";
import {
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
} from "@/db/queries";
import { dbConnect } from "@/services/mongo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "../auth";

async function registerUser(formData) {
  await dbConnect();
  const created = await createUser(formData);
  redirect("/login");
}

async function signInWithGoogle() {
  const response = await signIn("google"); // Prevent automatic redirect
  return response; // Return the response object
}

async function callCreateFaculty(formData) {
  await dbConnect();
  const created = await createFaculty(formData);
}

async function getAllUsers2() {
  try {
    await dbConnect();
    const users = await getAllUsers();
    return users;
  } catch (error) {
    throw error;
  }
}

async function getAllFaculties2() {
  try {
    await dbConnect();
    const users = await getAllFaculties();
    return users;
  } catch (error) {
    throw error;
  }
}

async function performLogin(formData) {
  await dbConnect();
  try {
    const found = await findUserByCredentials(formData);
    return found;
  } catch (error) {
    throw error;
  }
}

async function callUpdateUser(email, name, department, serial) {
  await dbConnect();
  try {
    await updateUser(email, name, department, serial);
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

async function callUpdateUserComment(email, comment) {
  await dbConnect();
  try {
    await updateUserComment(email, comment);
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

async function callUpdateFaculty(initial, name, department, courses, photo) {
  await dbConnect();
  try {
    await updateFaculty(initial, name, department, courses, photo);
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

async function callGetFacultyComments(initial) {
  await dbConnect();
  try {
    const comments = await getFacultyComments(initial);
    return comments; // Return the comments array
  } catch (error) {
    console.error("Error in callGetFacultyComments:", error);
    throw error;
  }
}

async function callGetFacultyRatings(initial) {
  await dbConnect();
  try {
    const ratings = await getFacultyRatings(initial);
    return ratings; // Return the ratings array
  } catch (error) {
    console.error("Error in callGetFacultyRatings:", error);
    throw error;
  }
}

async function callDeleteFaculty(initial) {
  await dbConnect();
  try {
    const success = await deleteFaculty(initial);
    if (success) {
      revalidatePath("/"); // Revalidate the page to reflect changes
    }
    return success;
  } catch (error) {
    throw error;
  }
}

async function callChangePassword(email, password) {
  await dbConnect();
  try {
    await changePassword(email, password);
    redirect("/");
  } catch (error) {
    throw error;
  }
}

async function callUpdateDays(email, days) {
  await dbConnect();
  try {
    await upDateDays(email, days);
    redirect("/");
  } catch (error) {
    throw error;
  }
}

async function callChangePhoto(email, photo) {
  await dbConnect();
  try {
    await changePhoto(email, photo);
    redirect("/profile");
  } catch (error) {
    throw error;
  }
}

async function callChangeCommentsFaculty(initial, comments) {
  await dbConnect();
  try {
    await changeCommentsFaculty(initial, comments);
  } catch (error) {
    throw error;
  }
}

async function callChangeRatingsFaculty(initial, stars) {
  await dbConnect();
  try {
    await changeRatingsFaculty(initial, stars);
  } catch (error) {
    throw error;
  }
}

export {
  callChangePassword,
  callChangePhoto,
  callChangeCommentsFaculty,
  callChangeRatingsFaculty,
  callCreateFaculty,
  callDeleteFaculty,
  callUpdateDays,
  callUpdateFaculty,
  callUpdateUser,
  callUpdateUserComment,
  getAllFaculties2,
  getAllUsers2,
  performLogin,
  registerUser,
  signInWithGoogle,
  callGetFacultyComments,
  callGetFacultyRatings,
};