"use server";
import { signIn, auth } from "../auth";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/services/mongo";
import {
  createUser,
  findUserByCredentials,
  getAllUsers,
  updateUser,
  changePassword,
  changePhoto,
  upDateDays,
  createFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
  changePhotoFaculty,
  updateUserComment,
} from "@/db/queries";
import { redirect } from "next/navigation";

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

async function callUpdateUser(email, name, phone, bio) {
  await dbConnect();
  try {
    await updateUser(email, name, phone, bio);
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

async function callUpdateFaculty(initial, name, department, courses) {
  await dbConnect();
  try {
    await updateFaculty(initial, name, department, courses);
    revalidatePath("/");
  } catch (error) {
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

async function callChangePhotoFaculty(initial, photo) {
  await dbConnect();
  try {
    await changePhotoFaculty(initial, photo);
  } catch (error) {
    throw error;
  }
}

export {
  registerUser,
  performLogin,
  getAllUsers2,
  callUpdateUser,
  callChangePassword,
  callChangePhoto,
  callUpdateDays,
  callCreateFaculty,
  getAllFaculties2,
  callUpdateFaculty,
  callDeleteFaculty,
  callChangePhotoFaculty,
  callUpdateUserComment,
  signInWithGoogle,
};
