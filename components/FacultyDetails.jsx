import { useAuth } from "@/app/hooks/useAuth";
import { useFaculty } from "@/app/hooks/usefaculty";
import { useTheme } from "@/app/hooks/useTheme";
import { useEffect, useState } from "react";
import InteractiveStarRating from "./InteractiveStarRating";
import StarRating from "./StarRating";
import YourComment from "./YourComment";
import { useRouter } from "next/navigation";

export default function FacultyDetails({
  setClicked,
  allFacultyCommentRating,
}) {
  const { theme } = useTheme();
  const { faculty } = useFaculty();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [yourComment, setYourComment] = useState("");
  const [othersComment, setOthersComment] = useState([]);
  const [isUpdatingRating, setIsUpdatingRating] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [ratingLabel, setRatingLabel] = useState("Your Rating");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth) {
      router.push("/login");
    }
  }, [auth, router]);

  // Compute yourComment and initialRating when auth and faculty change
  useEffect(() => {
    if (auth && faculty?.initial) {
      console.log("auth-dependent useEffect running", { auth, faculty });

      // Compute yourComment
      let computedYourComment = "";
      if (Array.isArray(auth.comment)) {
        for (const c of auth.comment) {
          if (
            c.initial &&
            c.initial.toUpperCase() === faculty.initial.toUpperCase()
          ) {
            computedYourComment = c.comment || "";
            break;
          }
        }
      }
      setYourComment(computedYourComment);
      console.log("Setting yourComment:", computedYourComment);

      // Compute initialRating
      let rating = 0;
      if (Array.isArray(auth.comment)) {
        for (const comment of auth.comment) {
          if (
            comment.initial &&
            comment.initial.toUpperCase() === faculty.initial.toUpperCase()
          ) {
            rating = Number(comment.stars) || 0;
            console.log("Found matching comment:", comment, "Rating:", rating);
            break;
          }
        }
      } else {
        console.log("Missing data for initialRating:", {
          hasComments: !!auth.comment,
          isArray: Array.isArray(auth.comment),
          hasInitial: !!faculty.initial,
        });
      }
      setInitialRating(rating);
      console.log("Setting initialRating:", rating);
    }
  }, [auth, faculty]);

  // Process others' comments
  useEffect(() => {
    if (faculty?.initial && allFacultyCommentRating?.length > 0) {
      const facultyData = allFacultyCommentRating.find(
        (item) => item.initial === faculty.initial.toUpperCase()
      );

      if (facultyData?.comment && auth) {
        const othersCommentData = facultyData.comment
          .filter((comment) => comment.username !== auth.name)
          .map(({ username, comment }) => ({
            name: username,
            comment,
          }));
        setOthersComment(othersCommentData);
      } else {
        setOthersComment([]);
      }
    } else {
      setOthersComment([]);
    }
  }, [faculty, allFacultyCommentRating, auth]);

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

  const facultyRating =
    allFacultyCommentRating.find(
      (item) => item.initial === faculty?.initial?.toUpperCase()
    )?.stars || 0;

  console.log(
    "FacultyDetails rendering, initialRating:",
    initialRating,
    "ratingLabel:",
    ratingLabel
  );

  return (
    <>
      <div
        className={`w-full h-full hidden sm:flex ${
          theme
            ? "bg-[#ffffff] text-[#0a0a0a]"
            : "bg-[#000000] text-[#ebebeb] relative"
        }`}
      >
        <div className="w-[70%] h-full flex flex-col">
          <div className="h-[15%] w-full">
            <div className="h-full w-full flex">
              <div className="w-[15%] h-full float-left flex items-center justify-center">
                <button
                  onClick={() => setClicked(false)}
                  className={`px-4 py-2 rounded-md font-semibold ${
                    theme
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-red-700 text-white hover:bg-red-800"
                  }`}
                >
                  Go Back
                </button>
              </div>
              <div className="w-[85%] h-full float-left flex items-center justify-center">
                {auth && (
                  <YourComment
                    setAuth={setAuth}
                    yourComment={yourComment}
                    setYourComment={setYourComment}
                    auth={auth}
                    faculty={faculty}
                    theme={theme}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            className={`h-[85%] w-full float-left overflow-hidden ${
              theme ? "bg-[#f5f5f5]" : "bg-[#1a1a1a]"
            }`}
          >
            <p className="font-semibold h-[10%] flex justify-center items-center w-full float-left">
              Others Comments:
            </p>
            <div className="h-[90%] w-full float-left overflow-y-auto px-4">
              {othersComment.length > 0 ? (
                othersComment.map(
                  (comment, index) =>
                    comment.comment && (
                      <div
                        key={index}
                        className={`mb-4 p-3 rounded-md ${
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
        <div
          className={`h-full w-[2px] ${
            theme ? "bg-[#cccccc]" : "bg-[#444444]"
          }`}
        ></div>
        <div className="w-[30%] h-full flex justify-center items-center p-6 relative overflow-y-auto">
          <div className="flex flex-col items-center">
            <div className="w-40 h-48 mb-4 rounded-lg overflow-hidden">
              {faculty?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={faculty.photo}
                  alt={`${faculty?.name || "Faculty"} photo`}
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <svg
                  className={`w-full h-full ${
                    theme
                      ? "bg-[#d5d5d5] text-[#0a0a0a] "
                      : "bg-[#333333] text-[#f0f0f0] "
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">
              {faculty?.name || "N/A"}
            </h2>
            <p className="text-lg mb-2 text-center">
              {faculty?.initial || "N/A"}
            </p>
            <p className="text-lg mb-2 text-center">
              {faculty?.department || "N/A"}
            </p>
            <p className="text-lg mb-2 text-center">
              {faculty?.courses?.join(", ") || "No courses listed"}
            </p>
            <div className="flex justify-center items-center mt-2">
              <StarRating rating={facultyRating} />
            </div>
            {auth && (
              <div className="mt-10 flex flex-col items-center">
                <p className="font-semibold mb-2 text-center">{ratingLabel}</p>
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
                />
              </div>
            )}
            {showRatingSuccess && (
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 ${
                  theme
                    ? "bg-green-100 text-green-800"
                    : "bg-green-900 text-green-200"
                } rounded-md opacity-90`}
              >
                <p className="font-semibold">Rating Updated Successfully!</p>
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
                    className={` rounded-sm h-[25px] w-[60px] font-semibold ${
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
                  />
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faculty.photo}
                      alt={`${faculty?.name || "Faculty"} photo`}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <svg
                      className={`w-full h-full ${
                        theme
                          ? "bg-[#d5d5d5] text-[#0a0a0a] "
                          : "bg-[#333333] text-[#f0f0f0] "
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
                  <StarRating rating={facultyRating} />
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
