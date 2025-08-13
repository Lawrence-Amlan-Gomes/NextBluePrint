"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EachField from "./EachField";
import {
  performLogin,
  getAllUsers2,
  signInWithGoogle,
  getAllFaculties2,
} from "@/app/actions";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/hooks/useTheme";
import Image from "next/image";
import googleIcon from "../../public/googleIcon.png";
import { useSession, signIn, signOut } from "next-auth/react";
import colors from "@/app/color/color";
import { useFaculty } from "@/app/hooks/usefaculty";

const LoginForm = () => {
  const {
    allFacultyCommentRating,
    setAllFacultyCommentRating,
    firstTime,
    setFirstTime,
    faculties,
    setFaculties,
    filteredFaculties,
    setFilteredFaculties,
  } = useFaculty();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { theme } = useTheme();
  const { setAuth, auth } = useAuth();
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(true);
  const [email, setEmail] = useState("");
  const [wantTo, setWantTo] = useState(false);
  const [mainError, setMainError] = useState({
    isError: false,
    error: "Email or password is incorrect",
  });
  const [googleError, setGoogleError] = useState({
    isError: false,
    error: "",
  });
  const [emailError, setEmailError] = useState({
    iserror: true,
    error: "Email is required",
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    iserror: true,
    error: "Password is required",
  });

  useEffect(() => {
    if (isTyping) {
      setIsLoading(false);
    }
  }, [isTyping]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch faculties
        const facultyData = await getAllFaculties2();
        setFaculties(facultyData);
        setFilteredFaculties(facultyData);

        // Fetch users
        const userData = await getAllUsers2();

        // Process user comments to create allFacultyCommentRating
        const facultyCommentsMap = {};

        userData.forEach((user) => {
          if (user.comment && Array.isArray(user.comment)) {
            user.comment.forEach(({ initial, comment, stars }) => {
              if (initial) {
                const upperInitial = initial.toUpperCase();
                if (!facultyCommentsMap[upperInitial]) {
                  facultyCommentsMap[upperInitial] = {
                    comments: [],
                    totalStars: 0,
                    count: 0,
                  };
                }
                facultyCommentsMap[upperInitial].comments.push({
                  username: user.name,
                  comment,
                });
                facultyCommentsMap[upperInitial].totalStars += stars || 0;
                facultyCommentsMap[upperInitial].count += 1;
              }
            });
          }
        });

        // Convert map to desired array format
        const facultyCommentRatingArray = Object.keys(facultyCommentsMap).map(
          (initial) => ({
            initial,
            comment: facultyCommentsMap[initial].comments,
            stars: Math.ceil(
              facultyCommentsMap[initial].totalStars /
                facultyCommentsMap[initial].count || 0
            ),
          })
        );

        setAllFacultyCommentRating(facultyCommentRatingArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [
    firstTime,
    setAllFacultyCommentRating,
    setFaculties,
    setFilteredFaculties,
    setFirstTime,
  ]);

  useEffect(() => {
    if (email != "") {
      setEmailError({
        iserror: false,
        error: "",
      });
    } else {
      setEmailError({
        iserror: true,
        error: "Email is required",
      });
    }
    if (password != "") {
      setPasswordError({
        iserror: false,
        error: "",
      });
    } else {
      setPasswordError({
        iserror: true,
        error: "Password is required",
      });
    }
  }, [email, password]);

  useEffect(() => {
    setMainError({
      isError: false,
      error: "Email or password is incorrect",
    });
    setGoogleError({
      isError: false,
      error: "",
    });
    setIsTyping(true);
  }, [email, password]);

  useEffect(() => {
    if (googleError.isError) {
      const timer = setTimeout(() => {
        setGoogleError({
          isError: false,
          error: "",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [googleError.isError]);

  const submitForm = async () => {
    if (!emailError.iserror && !passwordError.iserror) {
      setIsLoading(true);
      try {
        const found = await performLogin({
          email: email,
          password: password,
        });
        if (found) {
          setAuth(found);
          router.push("/");
          setIsLoading(false);
        } else {
          setEmailError({ 
            iserror: true,
            error: "Email or password is incorrect",
          });
          setPasswordError({
            iserror: true,
            error: "Email or password is incorrect",
          });
          setMainError({
            isError: true,
            error: "Email or password is incorrect",
          });
          setIsTyping(false);
        }
      } catch (error) {
        console.log("Something went wrong");
        setMainError({
          isError: true,
          error: "SomeThing Went Wrong",
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      if (!session?.user) {
        await signIn("google");
      } else {
        const users = await getAllUsers2();
        const matchedUser = users.find(
          (user) => user.email === session.user.email
        );

        if (matchedUser) {
          setAuth(matchedUser);
          router.push("/");
        } else {
          setGoogleError({
            isError: true,
            error: `Your email ${session.user.email} hasn't registered yet`,
          });
        }
      }
    } catch (error) {
      console.error("Error checking users:", error);
      setGoogleError({
        isError: true,
        error: "Something went wrong while checking user",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          submitForm();
        }
      }}
      className={`h-full w-full sm:p-0 p-[5%] overflow-y-auto lg:overflow-hidden lg:flex lg:justify-center lg:items-center ${
        theme
          ? `${colors.bgLight} ${colors.bgLight}`
          : `${colors.bgDark} ${colors.bgDark}`
      }`}
    >
      <div
        className={`sm:p-10 p-5 rounded-md sm:my-[5%] sm:w-[50%] sm:mx-[25%] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] lg:my-0 text-center ${
          theme ? `${colors.cardLight}` : `${colors.cardDark}`
        }`}
      >
        <div className="text-[20px] lg:text-[25px] 2xl:text-[40px] font-bold sm:mb-10">
          Login
        </div>
        {/* Trick the browser with this fake email and password field */}
        <div className="opacity-0">
          <EachField
            label="fake"
            type="email"
            name="email"
            isReal={false}
            placeholder="Enter your email"
            value={email}
            setValue={setEmail}
            iserror={emailError.iserror}
            error={emailError.error}
          />
          <EachField
            label="fake"
            type="password"
            name="password"
            isReal={false}
            placeholder="Enter your password"
            value={password}
            setValue={setPassword}
            iserror={passwordError.iserror}
            error={passwordError.error}
          />
        </div>
        <EachField
          label="Email"
          type="email"
          name="email"
          isReal={true}
          placeholder="Enter your email"
          value={email}
          setValue={setEmail}
          iserror={emailError.iserror}
          error={emailError.error}
        />
        <EachField
          label="Password"
          type="password"
          name="password"
          isReal={true}
          placeholder="Enter your password"
          value={password}
          setValue={setPassword}
          iserror={passwordError.iserror}
          error={passwordError.error}
        />
        {mainError.isError ? (
          <div className="mt-3 text-red-600 text-[10px] lg:text-[14px] 2xl:text-[22px]">
            {mainError.error}
          </div>
        ) : (
          <></>
        )}

        <button
          onClick={submitForm}
          className={`text-[12px] lg:text-[16px] 2xl:text-[25px] cursor-pointer rounded-lg mt-6 sm:mt-12 py-2 sm:px-6 px-4 ${
            !emailError.iserror && !passwordError.iserror
              ? "bg-green-800 hover:bg-green-700 text-white "
              : theme
              ? "bg-[#dddddd] text-[#888888]"
              : "bg-[#222222] text-[#888888]"
          }`}
        >
          {isLoading ? `Logging...` : `Login`}
        </button>
        <div className="w-full flex flex-col items-center justify-center">
          <button
            onClick={handleGoogleSignIn}
            className={`text-[12px] lg:text-[16px] 2xl:text-[25px] flex items-center gap-4 lg:h-[60px] h-[40px] cursor-pointer rounded-md mt-10 py-2 px-4 lg:px-6 ${
              theme
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-900 hover:bg-blue-950"
            } text-white`}
          >
            <div className="h-full flex justify-center items-center">
              <div className="h-[30px] sm:h-[50px] w-[30px] sm:w-[50px] relative">
                <Image
                  priority
                  src={googleIcon}
                  alt="Google Icon"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="h-full text-center flex justify-center items-center">
              <div>{isLoadingGoogle ? `Logging...` : `Log in with Google`}</div>
            </div>
          </button>
          {googleError.isError && (
            <div className="mt-2 text-red-600 text-[10px] lg:text-[14px] 2xl:text-[22px]">
              {googleError.error}
            </div>
          )}
        </div>
        <div className="sm:mt-18 mt-5 text-[12px] lg:text-[16px] 2xl:text-[26px]">
          No Account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
