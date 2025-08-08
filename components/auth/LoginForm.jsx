"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import EachField from "./EachField";
import { performLogin, getAllUsers2, signInWithGoogle } from "@/app/actions";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/hooks/useTheme";
import Image from "next/image";
import googleIcon from "../../public/googleIcon.png";
import { useSession } from "next-auth/react";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { theme } = useTheme();
  const { setAuth, googleAuth } = useAuth();
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(true);
  const [email, setEmail] = useState("");
  const [wantTo, setWantTo] = useState(false);
  const [mainError, setMainError] = useState({
    isError: false,
    error: "Email or password is incorrect",
  });
  const [emailError, setEmailError] = useState({
    iserror: false,
    error: "",
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    iserror: false,
    error: "",
  });

  useEffect(() => {
    if (isTyping) {
      setIsLoading(false);
    }
  }, [isTyping]);

  useEffect(() => {
    setEmailError({
      iserror: false,
      error: "",
    });
    setPasswordError({
      iserror: false,
      error: "",
    });
    setMainError({
      isError: false,
      error: "Email or password is incorrect",
    });
    setIsTyping(true);
  }, [email, password]);

  const submitForm = async () => {
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
          error: "",
        });
        setPasswordError({
          iserror: true,
          error: "",
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
  };

  const handleGoogleSignIn = async () => {
    if (session?.user) {
      setIsLoadingGoogle(true);
      try {
        const users = await getAllUsers2();
        const matchedUser = users.find(
          (user) => user.email === session.user.email
        );

        if (matchedUser) {
          setAuth(matchedUser);
          router.push("/");
        } else {
          router.push("/register");
        }
      } catch (error) {
        console.error("Error checking users:", error);
        setMainError({
          isError: true,
          error: "Something went wrong while checking user",
        });
      } finally {
        setIsLoadingGoogle(false);
      }
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
        theme ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-[#000000] text-[#ebebeb]"
      }`}
    >
      <div
        className={` p-10 rounded-lg sm:my-[5%] sm:w-[50%] sm:mx-[25%] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] lg:my-0  text-center shadow-lg ${
          theme ? "bg-[#ececec] text-[#0a0a0a]" : "bg-[#0f0f0f] text-[#f0f0f0]"
        }`}
      >
        <div className="text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] 2xl:text-[45px] font-bold mb-10 ">
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
          <div className="mt-3 text-red-600">{mainError.error}</div>
        ) : (
          <></>
        )}

        <button
          onClick={submitForm}
          className={`text-[18px] text-white cursor-pointer rounded-lg mt-10 py-2 px-6  ${"bg-green-800 hover:bg-green-700"}`}
        >
          {isLoading ? `Logging...` : `Login`}
        </button>
        <div
          className={
            "float-left w-full overflow-hidden flex mb-8 items-center justify-center"
          }
        >
          <button
            onClick={handleGoogleSignIn}
            className={`text-[16px] flex items-center gap-4 h-[60px] cursor-pointer w-[270px] rounded-md mt-10 py-2 px-6 bg-blue-800 hover:bg-blue-700 text-white`}
          >
            <div className="h-full float-left flex justify-center items-center">
              <div className="h-[50px] w-[50px] relative">
                {" "}
                <Image
                  priority
                  src={googleIcon}
                  alt={"Google Icon"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="h-full float-left text-center flex justify-center items-center">
              <div>{isLoadingGoogle ? `Logging...` : `Log in with Google`}</div>
            </div>
          </button>
        </div>
        <p className="mt-10 text-[16px] xl:text-[20px] 2xl:text-[26px]">
          No Account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
