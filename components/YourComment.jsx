import { callUpdateUserComment } from "@/app/actions";
import { useEffect, useState } from "react";
import colors from "@/app/color/color";

export default function YourComment({
  setAuth,
  yourComment,
  setYourComment,
  auth,
  faculty,
  theme,
}) {
  const [newCommentInput, setNewCommentInput] = useState(yourComment);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    // Initialize newCommentInput with yourComment when it changes
    setNewCommentInput(yourComment);
  }, [yourComment]);

  const handleUpdateComment = async () => {
    if (!auth?.email || !faculty?.initial) return;

    setIsUpdating(true);
    try {
      // Get the current user's comments
      const currentComments = auth.comment || [];

      // Create new comment array, updating only the comment for the current faculty
      const newComment = currentComments
        .filter(
          (comment) =>
            comment.initial?.toUpperCase() !== faculty.initial?.toUpperCase()
        )
        .concat({
          initial: faculty.initial,
          comment: newCommentInput,
          stars:
            currentComments.find(
              (comment) =>
                comment.initial?.toUpperCase() ===
                faculty.initial?.toUpperCase()
            )?.stars || 0,
        });

      setAuth((prev) => ({
        ...prev,
        comment: newComment,
      }));

      // Update the comment in the database
      await callUpdateUserComment(auth.email, newComment);

      // Update local state
      setYourComment(newCommentInput);

      // Show success pop-up
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Hide success pop-up after 1 second
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000); // Kept at 2 seconds as per your latest code
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
            placeholder="Enter your comment"
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
