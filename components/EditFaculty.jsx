"use client";
import { useTheme } from "@/app/hooks/useTheme";
import { useFaculty } from "@/app/hooks/usefaculty";
import { useEffect, useState } from "react";
import {
  callCreateFaculty,
  callUpdateFaculty,
  callDeleteFaculty,
} from "@/app/actions";
import landingFaculties from "@/app/landingFaculties/landingFaculties";

const EditFaculty = () => {
  const { theme } = useTheme();
  const { faculties } = useFaculty();
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [name, setName] = useState("");
  const [initial, setInitial] = useState("");
  const [photo, setPhoto] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [courses, setCourses] = useState("");
  const [initialError, setInitialError] = useState({
    iserror: false,
    error: "Initial is required",
  });
  const [allInitials, setAllInitials] = useState([]);
  const [canAdd, setCanAdd] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Set initials from faculties context
  useEffect(() => {
    const initials = faculties.map((faculty) => faculty.initial);
    setAllInitials(initials);
  }, [faculties]);

  // Handle initial input and faculty selection based on landingFaculties
  useEffect(() => {
    const upperInitial = initial.toUpperCase();
    if (upperInitial === "") {
      setInitialError({ iserror: true, error: "Initial is required" });
      setCanAdd(false);
      setCanEdit(false);
      setSelectedFaculty(null);
      setPhoto("");
    } else if (
      landingFaculties.some((f) => f.initial.toUpperCase() === upperInitial)
    ) {
      setInitialError({ iserror: false, error: "" });
      setCanAdd(false); // Deactivate Add if initial exists in landingFaculties
      setCanEdit(true); // Activate Update and Delete
      const faculty =
        faculties.find((f) => f.initial.toUpperCase() === upperInitial) ||
        landingFaculties.find((f) => f.initial.toUpperCase() === upperInitial);
      setSelectedFaculty(faculty || null);
      setPhoto(faculty?.photo || "");
    } else {
      setInitialError({ iserror: false, error: "" });
      setCanAdd(true); // Activate Add if initial does not exist
      setCanEdit(false); // Deactivate Update and Delete
      setSelectedFaculty(null);
      setPhoto("");
    }
  }, [initial, allInitials, faculties]);

  useEffect(() => {
    setCanAdd(canAdd && !initialError.iserror);
    setCanEdit(canEdit && !initialError.iserror);
  }, [initialError.iserror, canAdd, canEdit]);

  const handleAddFaculty = async () => {
    if (!canAdd) return;
    const sureSubmit = confirm("Are you sure to add this faculty?");
    setAddLoading(true);
    try {
      if (sureSubmit) {
        const upperInitial = initial.toUpperCase();
        if (
          landingFaculties.some((f) => f.initial.toUpperCase() === upperInitial)
        ) {
          setCanAdd(false);
          setCanEdit(true);
          return;
        }

        const facultyData = {
          name: name || "Unknown",
          initial: upperInitial,
          photo: photo || "",
          department: department || "Unknown",
          courses: courses
            ? courses.split(",").map((course) => course.trim())
            : [],
        };
        await callCreateFaculty(facultyData);
        setAddLoading(false);
        setName("");
        setInitial("");
        setPhoto("");
        setDepartment("CSE");
        setCourses("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
        setSelectedFaculty(null);
      } else {
        setAddLoading(false);
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
      setAddLoading(false);
    }
  };

  const handleUpdateFaculty = async () => {
    if (!canEdit) return;
    const sureSubmit = confirm("Are you sure to update this faculty?");
    setEditLoading(true);
    try {
      if (sureSubmit) {
        const upperInitial = initial.toUpperCase();
        const existingFaculty =
          faculties.find(
            (faculty) => faculty.initial.toUpperCase() === upperInitial
          ) ||
          landingFaculties.find(
            (faculty) => faculty.initial.toUpperCase() === upperInitial
          );
        if (!existingFaculty) {
          setCanEdit(false);
          setCanAdd(true);
          return;
        }

        const updatedName = name || existingFaculty.name;
        const updatedDepartment =
          department || existingFaculty.department || "Unknown";
        const updatedCourses = courses
          ? courses.split(",").map((course) => course.trim())
          : existingFaculty.courses || [];

        await callUpdateFaculty(
          upperInitial,
          updatedName,
          updatedDepartment,
          updatedCourses,
          photo // Use current photo state, which could be ""
        );
        setEditLoading(false);
        setName("");
        setInitial("");
        setPhoto("");
        setDepartment("");
        setCourses("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
        setSelectedFaculty(null);
      } else {
        setEditLoading(false);
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      setEditLoading(false);
    }
  };

  const handleDeleteFaculty = async () => {
    if (!canEdit) return;
    const sureDelete = confirm("Are you sure to delete this faculty?");
    setDeleteLoading(true);
    try {
      if (sureDelete) {
        const upperInitial = initial.toUpperCase();
        const success = await callDeleteFaculty(upperInitial);
        if (success) {
          setDeleteLoading(false);
          setName("");
          setInitial("");
          setPhoto("");
          setDepartment("");
          setCourses("");
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 1000);
          setSelectedFaculty(null);
        } else {
          setDeleteLoading(false);
          alert("Failed to delete faculty.");
        }
      } else {
        setDeleteLoading(false);
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setDeleteLoading(false);
      alert("An error occurred while deleting the faculty.");
    }
  };

  return (
    <div
      className={`h-screen w-full flex flex-col sm:flex-row overflow-y-auto relative ${
        theme ? "bg-[#ececec] text-[#0a0a0a]" : "bg-[#0f0f0f] text-[#f0f0f0]"
      }`}
    >
      {/* 70% Form Section */}
      <div className="w-full sm:w-[70%] p-[5%] overflow-y-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">
          Manage Faculty
        </h1>

        <div className="space-y-3 max-w-[900px] mx-auto">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Enter faculty name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md ${
                theme ? "border-zinc-300" : "border-zinc-700"
              } ${theme ? "bg-white" : "bg-zinc-800 text-white"}`}
            />
          </div>

          <div>
            <input
              type="text"
              name="initial"
              placeholder="Enter faculty initial"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              className={`w-full p-2 rounded-md ${
                initialError.iserror
                  ? "border-red-500"
                  : theme
                  ? "border-zinc-300"
                  : "border-zinc-700"
              } ${theme ? "bg-white" : "bg-zinc-800 text-white"}`}
            />
            {initialError.iserror && (
              <p className="text-red-500 text-sm mt-1">{initialError.error}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={`w-full p-2 rounded-md ${
                theme ? "border-zinc-300" : "border-zinc-700"
              } ${theme ? "bg-white" : "bg-zinc-800 text-white"}`}
            />
          </div>

          <div>
            <input
              type="text"
              name="courses"
              placeholder="Enter courses (comma-separated)"
              value={courses}
              onChange={(e) => setCourses(e.target.value)}
              className={`w-full p-2 rounded-md ${
                theme ? "border-zinc-300" : "border-zinc-700"
              } ${theme ? "bg-white" : "bg-zinc-800 text-white"}`}
            />
          </div>

          <div>
            <input
              type="text"
              name="photo"
              placeholder="Enter photo URL"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className={`w-full p-2 rounded-md mb-5 ${
                theme ? "border-zinc-300" : "border-zinc-700"
              } ${theme ? "bg-white" : "bg-zinc-800 text-white"}`}
            />
          </div>

          <div className="w-full flex justify-center">
            <div className="w-[40%]">
              <div className="w-full flex justify-center items-center">
                <button
                  onClick={handleAddFaculty}
                  disabled={!canAdd}
                  className={`text-[18px] cursor-pointer rounded-md py-2 mb-3 px-6 shadow-md ${
                    canAdd
                      ? "bg-green-800 hover:bg-green-700 text-white"
                      : theme
                      ? "bg-[#dbdbdb] text-[#808080]"
                      : "bg-[#1a1a1a] text-[#696969]"
                  }`}
                >
                  {addLoading ? `Adding...` : `Add Faculty`}
                </button>
              </div>

              <div className="w-full flex justify-center items-center">
                <button
                  onClick={handleUpdateFaculty}
                  disabled={!canEdit}
                  className={`text-[18px] cursor-pointer rounded-md py-2 mb-3 px-6 shadow-md ${
                    canEdit
                      ? "bg-blue-800 hover:bg-blue-700 text-white"
                      : theme
                      ? "bg-[#dbdbdb] text-[#808080]"
                      : "bg-[#1a1a1a] text-[#696969]"
                  }`}
                >
                  {editLoading ? `Updating...` : `Edit Faculty`}
                </button>
              </div>

              <div className="w-full flex justify-center items-center">
                <button
                  onClick={handleDeleteFaculty}
                  disabled={!canEdit}
                  className={`text-[18px] cursor-pointer rounded-md py-2 px-6 shadow-md ${
                    canEdit
                      ? "bg-red-800 hover:bg-red-700 text-white"
                      : theme
                      ? "bg-[#dbdbdb] text-[#808080]"
                      : "bg-[#1a1a1a] text-[#696969]"
                  }`}
                >
                  {deleteLoading ? `Deleting...` : `Delete Faculty`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 30% Faculty Card Section */}
      <div
        className={`w-full sm:w-[30%] p-[5%] overflow-y-auto ${
          theme
            ? "bg-[#ececec] border-l border-zinc-300"
            : "bg-[#0f0f0f] border-l border-zinc-700"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Faculty Details</h2>
        <div
          className={`p-4 rounded-lg ${
            theme
              ? "bg-white border border-zinc-300"
              : "bg-zinc-800 border border-zinc-700"
          }`}
        >
          {selectedFaculty ? (
            <div className="flex flex-col items-center">
              <div className="w-[150px] h-[200px] rounded-lg overflow-hidden flex items-center justify-center">
                {selectedFaculty.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedFaculty.photo}
                    alt="faculty photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-full h-full text-zinc-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg text-center font-semibold mt-2">
                {selectedFaculty.name || "Unknown"}
              </h3>
              <p className="text-sm">{selectedFaculty.initial}</p>
              <p className="text-sm">{selectedFaculty.department}</p>
              <div className="text-sm mt-2">
                <span className="font-medium">Courses:</span>{" "}
                {selectedFaculty.courses && selectedFaculty.courses.length > 0
                  ? selectedFaculty.courses.join(", ")
                  : "None"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-zinc-500">
              {canEdit ? (
                <>
                  <div className="w-[150px] h-[200px] rounded-sm flex items-center justify-center">
                    Loading...
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[150px] h-[200px] rounded-sm flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-zinc-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <p className="mt-2">No faculty selected</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >
          <div
            className={`p-4 rounded-lg text-white text-center shadow-lg ${
              theme ? "bg-green-600" : "bg-green-800"
            }`}
          >
            <p>Operation Successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFaculty;
