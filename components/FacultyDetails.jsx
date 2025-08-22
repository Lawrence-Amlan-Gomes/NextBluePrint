import { useAuth } from "@/app/hooks/useAuth";
import { useFaculty } from "@/app/hooks/usefaculty";
import { useTheme } from "@/app/hooks/useTheme";
import { useEffect, useState } from "react";
import InteractiveStarRating from "./InteractiveStarRating";
import StarRating from "./StarRating";
import YourComment from "./YourComment";
import { useRouter } from "next/navigation";
import colors from "@/app/color/color";
import { callGetFacultyComments, callGetFacultyRatings } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";

export default function FacultyDetails({ setClicked }) {
  const { theme } = useTheme();
  const {
    faculty,
    allFacultyComment,
    setAllFacultyComment,
    allFacultyRating,
    setAllFacultyRating,
  } = useFaculty();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [yourComment, setYourComment] = useState("");
  const [othersComment, setOthersComment] = useState([]);
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [ratingLabel, setRatingLabel] = useState("Your Rating");
  const [facultyRating, setFacultyRating] = useState(0);

  // Redirect to /login if auth is not present
  useEffect(() => {
    if (!auth) {
      console.log("No auth detected, redirecting to /login");
      router.push("/login");
    }
  }, [auth, router]);

  // Fetch comments and ratings if not already in state
  useEffect(() => {
    const fetchFacultyCommentsAndRatings = async () => {
      try {
        // Check if comments for faculty.initial exist in allFacultyComment
        if (
          !allFacultyComment.find((item) => item.initial === faculty.initial)
        ) {
          const comments = await callGetFacultyComments(faculty.initial);
          setAllFacultyComment((prev) => [
            ...prev.filter((item) => item.initial !== faculty.initial),
            { initial: faculty.initial, comments },
          ]);
        }

        // Check if ratings for faculty.initial exist in allFacultyRating
        if (
          !allFacultyRating.find((item) => item.initial === faculty.initial)
        ) {
          const ratings = await callGetFacultyRatings(faculty.initial);
          setAllFacultyRating((prev) => [
            ...prev.filter((item) => item.initial !== faculty.initial),
            { initial: faculty.initial, comments: ratings },
          ]);
        }
      } catch (error) {
        console.error("Error fetching faculty comments and ratings:", error);
      }
    };

    if (faculty?.initial) {
      console.log(
        "Fetching faculty comments and ratings for:",
        faculty.initial
      );
      fetchFacultyCommentsAndRatings();
    }
  }, [
    faculty.initial,
    allFacultyComment,
    allFacultyRating,
    setAllFacultyComment,
    setAllFacultyRating,
  ]);

  // Compute yourComment, initialRating, othersComment, and facultyRating
  useEffect(() => {
    if (auth && faculty?.initial) {
      // Find faculty comments and ratings
      const facultyComments =
        allFacultyComment.find((item) => item.initial === faculty.initial)
          ?.comments || [];
      const facultyRatings =
        allFacultyRating.find((item) => item.initial === faculty.initial)
          ?.comments || [];

      // Compute yourComment
      const yourCommentData = facultyComments.find(
        (comment) => Object.keys(comment)[0] === auth.name
      );
      setYourComment(yourCommentData ? Object.values(yourCommentData)[0] : "");

      // Compute initialRating
      const yourRatingData = facultyRatings.find(
        (rating) => Object.keys(rating)[0] === auth.name
      );
      setInitialRating(
        yourRatingData ? Number(Object.values(yourRatingData)[0]) : 0
      );

      // Compute othersComment (exclude auth.name)
      const othersCommentData = facultyComments
        .filter((comment) => Object.keys(comment)[0] !== auth.name)
        .map((comment) => ({
          name: Object.keys(comment)[0],
          comment: Object.values(comment)[0],
        }));
      setOthersComment(othersCommentData);

      // Compute facultyRating (average of all ratings)
      const ratings = facultyRatings.map((rating) =>
        Number(Object.values(rating)[0])
      );
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
      setFacultyRating(averageRating);
    } else {
      setOthersComment([]);
      setFacultyRating(0);
      setYourComment("");
      setInitialRating(0);
    }
  }, [auth, faculty, allFacultyComment, allFacultyRating]);

  // Hide rating success pop-up after 1 second
  useEffect(() => {
    if (showRatingSuccess) {
      const timer = setTimeout(() => {
        setShowRatingSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showRatingSuccess]);

  // Handle rating change from InteractiveStarRating
  const handleRatingChange = (newRating) => {
    setShowRatingSuccess(true);
    console.log("FacultyDetails received new rating:", newRating);
    setInitialRating(newRating); // Update initialRating immediately
  };

  // Handle hover events
  const handleHoverStart = () => {
    setRatingLabel("Change Rating");
    console.log("Rating label set to: Change Rating");
  };

  const handleHoverEnd = () => {
    setRatingLabel("Your Rating");
    console.log("Rating label set to: Your Rating");
  };

  return (
    <>
      <div
        className={`hidden sm:flex w-full h-full ${
          theme ? colors.bgLight : colors.bgDark
        }`}
      >
        {/* LEFT SIDE - Comments Section */}
        <div className="w-[70%] flex flex-col p-4 lg:p-6 pr-0 lg:pr-0">
          {/* Top: Go Back + Your Comment */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => setClicked(false)}
              className={`px-4 py-2 rounded-md font-semibold text-sm md:text-base shadow-sm ${
                theme
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-700 text-white hover:bg-red-800"
              }`}
            >
              Go Back
            </button>
            <div className="flex-1 ml-4">
              {auth && (
                <YourComment
                  setAuth={setAuth}
                  yourComment={yourComment}
                  setYourComment={setYourComment}
                  auth={auth}
                  faculty={faculty}
                  theme={theme}
                  allFacultyComment={allFacultyComment}
                  setAllFacultyComment={setAllFacultyComment}
                />
              )}
              {!auth && (
                <Link href="/login">
                  <div className="h-full w-full flex justify-center items-center">
                    <button
                      className={`text-[12px] lg:text-[16px] 2xl:text-[25px] cursor-pointer rounded-lg py-2 sm:px-6 px-4 ${"bg-green-800 hover:bg-green-700 text-white "}`}
                    >
                      {`You have to Login first`}
                    </button>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Others Comments */}
          <div
            className={`flex-1 rounded-lg overflow-hidden ${
              theme ? colors.cardLight : colors.cardDark
            }`}
          >
            <h2 className="font-bold text-base md:text-lg 2xl:text-[25px] mt-2 p-3 2xl:mt-3 dark:border-gray-700 text-center">
              Others Comments
            </h2>
            <div className="h-full max-h-full overflow-y-auto px-4 py-3 space-y-3">
              {othersComment.length > 0 ? (
                othersComment.map(
                  (comment, index) =>
                    comment.comment && (
                      <div
                        key={index}
                        className={`p-3 2xl:p-4 rounded-md border-[1px] ${
                          theme
                            ? "bg-[#eeeeee] border-[#dddddd]"
                            : "bg-[#111111] border-[#222222]"
                        }`}
                      >
                        <p className="font-semibold text-sm md:text-[14px] sm:text-[12px] xl:text-[16px] 2xl:text-[20px] mb-1 2xl:mb-2">
                          {comment.name}:
                        </p>
                        <p className="text-xs leading-snug md:text-[14px] sm:text-[12px] xl:text-[16px] 2xl:text-[20px]">
                          {comment.comment}
                        </p>
                      </div>
                    )
                )
              ) : (
                <p className="text-sm italic text-gray-500 text-center md:text-[12px]">
                  No comments from others yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Faculty Details */}
        <div className="w-[30%] overflow-auto h-full flex justify-center items-center p-4 lg:p-6 relative">
          <div
            className={`w-full rounded-xl p-4 lg:p-6 2xl:p-10 flex flex-col items-center ${
              theme ? `${colors.cardLight}` : `${colors.cardDark}`
            }`}
          >
            {/* Faculty Image */}
            <div className="w-28 h-32 md:w-36 md:h-44 lg:w-[200px] lg:h-[225px] xl:w-[270px] xl:h-[290px] 2xl:w-[300px] 2xl:h-[380px] rounded-lg overflow-hidden shadow-md mb-4">
              {faculty?.photo ? (
                <Image
                  src={faculty.photo}
                  alt={`${faculty?.name || "Faculty"} photo`}
                  width={300}
                  height={380}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <svg
                  className={`w-full h-full ${
                    theme
                      ? "bg-gray-300 text-gray-600"
                      : "bg-gray-700 text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* Faculty Info */}
            <p className="text-lg sm:text-[14px] leading-[25px] 2xl:leading-[40px] 2xl:mt-3 lg:mb-2 lg:text-[20px] xl:text-2xl 2xl:text-[35px] font-bold text-center">
              {faculty?.name || "N/A"}
            </p>
            <p className="text-sm sm:text-[12px] xl:text-lg 2xl:text-[25px] 2xl:mt-2 text-center opacity-80">
              {faculty?.initial || "N/A"}
            </p>
            <p className="text-sm sm:text-[12px] xl:text-lg 2xl:text-[25px] 2xl:mt-2 text-center opacity-80">
              {faculty?.department || "N/A"}
            </p>
            <p className="text-xs sm:text-[12px] xl:text-lg 2xl:text-[25px] 2xl:mt-2 text-center opacity-70">
              {faculty?.courses?.join(", ") || "No courses listed"}
            </p>

            {/* Average Rating */}
            <div className="flex justify-center items-center 2xl:mt-4">
              {facultyRating !== null && <StarRating rating={facultyRating} />}
            </div>

            {/* Your Rating */}
            {auth && (
              <div className="lg:mt-6 sm:mt-2 flex flex-col items-center">
                <p className="font-semibold lg:mb-2 text-xs md:text-sm lg:text-[18px] 2xl:mt-5 2xl:text-[28px] text-center">
                  {ratingLabel}
                </p>
                <InteractiveStarRating
                  initialRating={initialRating}
                  onRatingChange={handleRatingChange}
                  disabled={isUpdatingRating}
                  theme={theme}
                  auth={auth}
                  faculty={faculty}
                  setAuth={setAuth}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                  allFacultyRating={allFacultyRating}
                  setAllFacultyRating={setAllFacultyRating}
                />
              </div>
            )}

            {/* Success Popup */}
            {showRatingSuccess && (
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 rounded-xl shadow-lg ${
                  theme
                    ? "bg-green-100 text-green-800"
                    : "bg-green-900 text-green-200"
                } opacity-90`}
              >
                <p className="font-semibold text-center">
                  Rating Updated Successfully!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`w-full h-full flex sm:hidden ${
          theme
            ? "bg-[#ffffff] text-[#0a0a0a]"
            : "bg-[#000000] text-[#ebebeb] relative"
        }`}
      >
        <div className="h-full w-full">
          <div className="w-full h-[30%]">
            <div
              className={`w-[65%] h-full relative float-left border-r-[1px] ${
                theme ? "border-zinc-300" : "border-zinc-700"
              }`}
            >
              <div className="w-full h-[30%] float-left">
                <div className="w-[40%] h-full float-left flex text-[11px] items-center justify-center">
                  <button
                    onClick={() => setClicked(false)}
                    className={`rounded-sm h-[25px] w-[60px] font-semibold ${
                      theme
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-700 text-white hover:bg-red-800"
                    }`}
                  >
                    Go Back
                  </button>
                </div>
                <div className="w-[60%] h-full float-left flex justify-center items-center text-[12px] font-bold">
                  Your Comment:
                </div>
              </div>

              <div className="w-full h-[30%] float-left">
                {auth && (
                  <YourComment
                    setAuth={setAuth}
                    yourComment={yourComment}
                    setYourComment={setYourComment}
                    auth={auth}
                    faculty={faculty}
                    theme={theme}
                    allFacultyComment={allFacultyComment}
                    setAllFacultyComment={setAllFacultyComment}
                  />
                )}
                {!auth && (
                  <Link href="/login">
                    <div className="h-full w-full flex justify-center items-center">
                      <button
                        className={`text-[12px] lg:text-[16px] 2xl:text-[25px] cursor-pointer rounded-lg py-2 sm:px-6 px-4 ${"bg-green-800 hover:bg-green-700 text-white "}`}
                      >
                        {`You have to Login first`}
                      </button>
                    </div>
                  </Link>
                )}
              </div>
              <div className="w-full h-[40%] float-left">
                {auth && (
                  <div className="flex mt-2 flex-col items-center relative">
                    <p className="font-semibold mb-1 text-[12px] sm:text-[18px] text-center">
                      {ratingLabel}
                    </p>
                    <InteractiveStarRating
                      initialRating={initialRating}
                      onRatingChange={handleRatingChange}
                      disabled={isUpdatingRating}
                      theme={theme}
                      auth={auth}
                      faculty={faculty}
                      setAuth={setAuth}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={handleHoverEnd}
                      allFacultyRating={allFacultyRating}
                      setAllFacultyRating={setAllFacultyRating}
                    />
                    {showRatingSuccess && (
                      <div
                        className={`absolute top-0 left-0 w-full h-full flex text-[10px] text-center items-center justify-center z-10 ${
                          theme
                            ? "bg-green-100 text-green-800"
                            : "bg-green-900 text-green-200"
                        } opacity-100`}
                      >
                        <p className="font-semibold">
                          Rating Updated Successfully!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-[35%] h-full float-left flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="w-[60px] h-[70px] mb-2 mt-2 rounded-lg overflow-hidden">
                  {faculty?.photo ? (
                    <Image
                      src={faculty.photo}
                      alt={`${faculty?.name || "Faculty"} photo`}
                      width={60}
                      height={70}
                      className="w-full h-full object-cover rounded-sm"
                      priority
                    />
                  ) : (
                    <svg
                      className={`w-full h-full ${
                        theme
                          ? "bg-[#d5d5d5] text-[#0a0a0a]"
                          : "bg-[#333333] text-[#f0f0f0]"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-[10px] font-bold mb-1 text-center">
                  {faculty?.name || "N/A"}
                </h2>
                <p className="text-[10px] mb-1 text-center">
                  {faculty?.initial || "N/A"}
                </p>
                <div className="flex justify-center items-center">
                  {facultyRating !== null && (
                    <StarRating rating={facultyRating} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`h-[70%] w-full text-[13px] float-left overflow-hidden border-t-[1px] ${
              theme
                ? "bg-[#f5f5f5] border-zinc-300"
                : "bg-[#1a1a1a] border-zinc-700"
            }`}
          >
            <p className="font-semibold h-[10%] flex justify-center items-center w-full float-left">
              Others Comments:
            </p>
            <div className="h-[90%] w-full float-left overflow-y-auto px-2">
              {othersComment.length > 0 ? (
                othersComment.map(
                  (comment, index) =>
                    comment.comment && (
                      <div
                        key={index}
                        className={`mb-2 p-2 rounded-md ${
                          theme ? "bg-white" : "bg-[#2a2a2a]"
                        }`}
                      >
                        <p className="font-semibold">{comment.name}:</p>
                        <p>{comment.comment}</p>
                      </div>
                    )
                )
              ) : (
                <p>No comments from others yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
