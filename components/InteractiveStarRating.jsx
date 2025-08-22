import { useState, useEffect } from "react";
import { callChangeRatingsFaculty } from "@/app/actions";

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
  allFacultyRating,
  setAllFacultyRating,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isHoveringZeroStar, setIsHoveringZeroStar] = useState(false);
  const [selectedRating, setSelectedRating] = useState(initialRating || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Log state for debugging
  useEffect(() => {
    console.log("InteractiveStarRating state:", {
      initialRating,
      selectedRating,
      facultyInitial: faculty?.initial,
      allFacultyRating,
      isHoveringZeroStar,
    });
  }, [initialRating, selectedRating, faculty?.initial, allFacultyRating, isHoveringZeroStar]);

  // Sync selectedRating with initialRating
  useEffect(() => {
    setSelectedRating(initialRating || 0);
    console.log("Synced selectedRating with initialRating:", initialRating || 0);
  }, [initialRating]);

  const handleClick = async (rating) => {
    if (disabled || isUpdating || !auth?.email || !auth?.name || !faculty?.initial) {
      console.log("Rating update blocked:", {
        disabled,
        isUpdating,
        authEmail: auth?.email,
        authName: auth?.name,
        facultyInitial: faculty?.initial,
      });
      return;
    }

    setIsUpdating(true);
    try {
      const facultyRatings = allFacultyRating.find(
        (item) => item.initial === faculty.initial
      )?.comments || [];

      console.log("Current faculty ratings:", facultyRatings);
      console.log("Updating rating for user:", auth.email, "to", rating);

      const updatedRatings = rating > 0
        ? [
            ...facultyRatings.filter((r) => r.email !== auth.email),
            { email: auth.email, name: auth.name, rating: rating },
          ]
        : facultyRatings.filter((r) => r.email !== auth.email);

      console.log("Updated ratings to be sent:", {
        initial: faculty.initial,
        comments: updatedRatings,
      });

      await callChangeRatingsFaculty(faculty.initial, updatedRatings);

      setAllFacultyRating((prev) => {
        const newFacultyRating = [
          ...prev.filter((item) => item.initial !== faculty.initial),
          { initial: faculty.initial, comments: updatedRatings },
        ];
        console.log("Updated allFacultyRating:", newFacultyRating);
        return newFacultyRating;
      });

      setSelectedRating(rating);
      onRatingChange(rating);
      console.log("Rating update successful, new selected rating:", rating);
    } catch (error) {
      console.error("Error updating rating in InteractiveStarRating:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMouseEnter = (rating) => {
    if (disabled || isUpdating) return;
    setHoveredRating(rating);
    setIsHoveringZeroStar(rating === 0);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    if (disabled || isUpdating) return;
    setHoveredRating(0);
    setIsHoveringZeroStar(false);
    onHoverEnd();
  };

  return (
    <div className="flex justify-center text-[12px] lg:text-[16px] xl:text-[20px] 2xl:text-[30px] 2xl:mt-3 items-center gap-1">
      {[0, 1, 2, 3, 4, 5].map((star) => {
        // Determine color based on hover and rating state
        let starColor = "";
        let condition = "";

        if (hoveredRating > 0) {
          // Hover on stars 1–5: 0 star gray, stars 1 to hoveredRating blue, others gray
          condition = "Hover on stars 1–5";
          starColor =
            star === 0
              ? theme
                ? "text-gray-300"
                : "text-gray-600"
              : star <= hoveredRating
              ? "text-blue-600"
              : theme
              ? "text-gray-300"
              : "text-gray-600";
        } else if (isHoveringZeroStar) {
          // Hover on 0 star: 0 star red, others gray
          condition = "Hover on 0 star";
          starColor =
            star === 0
              ? theme
                ? "text-red-400"
                : "text-red-600"
              : theme
              ? "text-gray-300"
              : "text-gray-600";
        } else if (selectedRating > 0) {
          // No hover, rated: 0 star gray, stars 1 to selectedRating blue, others gray
          condition = "No hover, rated";
          starColor =
            star === 0
              ? theme
                ? "text-gray-300"
                : "text-gray-600"
              : star <= selectedRating
              ? "text-blue-600"
              : theme
              ? "text-gray-300"
              : "text-gray-600";
        } else {
          // No hover, not rated: 0 star red, others gray
          condition = "No hover, not rated";
          starColor =
            star === 0
              ? theme
                ? "text-red-400"
                : "text-red-600"
              : theme
              ? "text-gray-300"
              : "text-gray-600";
        }

        console.log(`Star ${star} color:`, {
          starColor,
          selectedRating,
          hoveredRating,
          isHoveringZeroStar,
          condition,
          theme: theme ? "light" : "dark",
        });

        return (
          <svg
            key={star}
            className={`sm:w-[20px] lg:w-[25px] 2xl:w-[35px] sm:h-8 w-5 h-5 cursor-pointer ${
              star === 0 ? "mr-5" : ""
            } ${starColor} ${disabled || isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          >
            {star === 0 ? (
              <path d="M12 2L15 8.6L22 9.2L17 14.1L18.3 21L12 18.3L5.7 21L7 14.1L2 9.2L9 8.6L12 2Z" />
            ) : (
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            )}
          </svg>
        );
      })}
    </div>
  );
}