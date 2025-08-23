import { useEffect, useState } from "react";
import colors from "@/app/color/color";
import { callChangeCommentsFaculty } from "@/app/actions";

export default function YourComment({
  setAuth,
  yourComment,
  setYourComment,
  auth,
  faculty,
  theme,
  allFacultyComment,
  setAllFacultyComment,
}) {
  const [newCommentInput, setNewCommentInput] = useState(yourComment);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setNewCommentInput(yourComment);
  }, [yourComment]);

  const handleUpdateComment = async () => {
    if (!auth?.email || !faculty?.initial) return;

    setIsUpdating(true);
    try {
      // Get current comments for the faculty
      const facultyComments = allFacultyComment.find(
        (item) => item.initial === faculty.initial
      )?.comments || [];

      // Update comments: remove user's comment if empty, otherwise update/add
      const updatedComments = newCommentInput.trim()
        ? [
            ...facultyComments.filter(
              (comment) => comment.email !== auth.email
            ),
            { email: auth.email, name: auth.name, comment: newCommentInput },
          ]
        : facultyComments.filter((comment) => comment.email !== auth.email);

      // Update database
      await callChangeCommentsFaculty(faculty.initial, updatedComments);

      // Update local state
      setAllFacultyComment((prev) => [
        ...prev.filter((item) => item.initial !== faculty.initial),
        { initial: faculty.initial, comments: updatedComments },
      ]);

      // Update local comment state
      setYourComment(newCommentInput.trim());
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Hide success pop-up after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div
      className={`p-2 sm:rounded-md w-full sm:h-[50px] lg:h-[65px] lg:px-3 2xl:h-[80px] 2xl:px-4 h-full flex flex-row items-center sm:gap-4 gap-2 relative ${
        theme ? colors.cardLight : colors.cardDark
      }`}
    >
      <div className="w-[20%] sm:block sm:text-[10px] hidden lg:text-[14px] xl:text-[16px] 2xl:text-[20px]">
        <p className="sm:font-semibold">Your Comment:</p>
      </div>
      {auth && (
        <>
          <input
            type="text"
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
            placeholder="Enter comment (max 100 chars)"
            maxLength={100}
            className={`sm:p-2 p-1 rounded-sm sm:text-[10px] lg:text-[14px] 2xl:text-[22px] sm:rounded-md sm:border-2 border-[1px] text-[12px] xl:text-[16px] sm:w-[60%] w-[70%] ${
              theme
                ? "bg-white text-[#0a0a0a] border-[#cccccc]"
                : "bg-[#2a2a2a] text-[#ebebeb] border-[#444444]"
            } focus:outline-none focus:border-blue-500`}
          />
          <button
            onClick={handleUpdateComment}
            disabled={isUpdating}
            className={`sm:p-2 p-1 rounded-sm sm:rounded-md font-semibold text-[12px] lg:text-[14px] sm:text-[10px] xl:text-[16px] 2xl:text-[22px] sm:w-[20%] w-[30%] ${
              isUpdating
                ? theme
                  ? "bg-[#dbdbdb] text-[#808080]"
                  : "bg-[#282828] text-[#696969]"
                : theme
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            {isUpdating ? "Updating..." : "Edit"}
          </button>
        </>
      )}
      {showSuccess && (
        <div
          className={`absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 ${
            theme
              ? "bg-green-100 text-green-800"
              : "bg-green-900 text-green-200"
          } rounded-md opacity-90`}
        >
          <p className="font-semibold sm:text-[18px] text-[12px]">
            Comment Updated Successfully!
          </p>
        </div>
      )}
    </div>
  );
}