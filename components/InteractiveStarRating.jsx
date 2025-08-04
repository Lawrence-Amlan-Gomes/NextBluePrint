import { useState, useEffect } from "react";
import { callUpdateUserComment } from "@/app/actions";

export default function InteractiveStarRating({
  initialRating,
  onRatingChange,
  disabled,
  theme,
  auth,
  faculty,
  setAuth,
  onHoverStart,
  onHoverEnd,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync selectedRating with initialRating when it changes
  useEffect(() => {
    console.log("InteractiveStarRating received initialRating:", initialRating); // Debug log
    setSelectedRating(initialRating || 0);
  }, [initialRating]);

  const handleClick = async (rating) => {
    if (disabled || isUpdating || !auth?.email || !faculty?.initial) return;

    setIsUpdating(true);
    try {
      const currentComments = auth.comment || [];
      const newComment = currentComments
        .filter(
          (comment) =>
            comment.initial?.toUpperCase() !== faculty.initial?.toUpperCase()
        )
        .concat({
          initial: faculty.initial,
          comment:
            currentComments.find(
              (comment) =>
                comment.initial?.toUpperCase() ===
                faculty.initial?.toUpperCase()
            )?.comment || "",
          stars: rating,
        });

      await callUpdateUserComment(auth.email, newComment);
      setAuth((prevAuth) => ({
        ...prevAuth,
        comment: newComment,
      }));
      setSelectedRating(rating);
      onRatingChange(rating);
      console.log("InteractiveStarRating updated rating:", rating, "New comment:", newComment); // Debug log
    } catch (error) {
      console.error("Error updating rating in InteractiveStarRating:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMouseEnter = (rating) => {
    if (disabled || isUpdating) return;
    setHoveredRating(rating);
    onHoverStart(); // Notify parent of hover start
    console.log("Hover started on star:", rating); // Debug log
  };

  const handleMouseLeave = () => {
    if (disabled || isUpdating) return;
    setHoveredRating(0);
    onHoverEnd(); // Notify parent of hover end
    console.log("Hover ended"); // Debug log
  };

  return (
    <div className="flex justify-center items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`sm:w-8 sm:h-8 w-5 h-5 cursor-pointer ${
            star <= (hoveredRating || selectedRating)
              ? theme
                ? "text-blue-600"
                : "text-blue-600"
              : theme
              ? "text-gray-300"
              : "text-gray-600"
          } ${disabled || isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}