"use client";
import { getAllUsers2, registerUser, signInWithGoogle } from "@/app/actions";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/hooks/useTheme";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import googleIcon from "../../public/googleIcon.png";
import EachField from "./EachField";

const RegistrationForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { googleAuth, setGoogleAuth } = useAuth();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [name, setName] = useState("");
  const [noError, setNoError] = useState(false);
  const [nameError, setNameError] = useState({
    iserror: false,
    error: "Name is required",
  });
  const [firstTimeEmailCheck, setFirstTimeEmailCheck] = useState(true);
  const [email, setEmail] = useState("");
  const [allEmails, setAllEmails] = useState([]);
  const [emailError, setEmailError] = useState({
    iserror: true,
    error: "Email is required",
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState({
    iserror: true,
    error: "Your password must be at least 8 characters",
  });

  // Fetch all emails once on component mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setIsLoadingGoogle(true);
        const users = await getAllUsers2({});
        const emails = users.map((user) => user.email);
        setAllEmails(emails);
        setIsLoadingGoogle(false);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
        setEmailError({
          iserror: true,
          error: "Failed to verify email availability",
        });
      }
    };
    fetchEmails();
  }, []);

  // Set Google auth data from session
  useEffect(() => {
    if (session?.user) {
      setGoogleAuth({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    }
  }, [session, setGoogleAuth]);

  // Validate name
  useEffect(() => {
    if (name === "") {
      setNameError({ ...nameError, iserror: true });
    } else {
      setNameError({ ...nameError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // Validate email
  useEffect(() => {
    if (email === "") {
      setEmailError({ iserror: true, error: "Email is required" });
    } else if (email !== email.toLowerCase()) {
      setEmailError({
        iserror: true,
        error: "Email must be in lowercase letters",
      });
    } else if (email.slice(-10) !== "@gmail.com") {
      setEmailError({
        iserror: true,
        error: "Use @gmail.com as your email format",
      });
    } else if (allEmails.includes(email)) {
      setEmailError({
        iserror: true,
        error: "This email is already taken",
      });
    } else {
      setEmailError({ ...emailError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, allEmails]);

  // Handle first-time email check
  useEffect(() => {
    if (firstTimeEmailCheck && allEmails.length > 0) {
      setTimeout(() => {
        if (allEmails.includes(email)) {
          setEmailError({
            iserror: true,
            error: "This email is already taken",
          });
        }
        setFirstTimeEmailCheck(false);
      }, 3000);
    }
  }, [allEmails, email, firstTimeEmailCheck]);

  // Handle Google registration
  // useEffect(() => {
  //   const registerGoogleUser = async () => {
  //     if (!googleAuth.email || isLoadingGoogle || allEmails.length === 0) {
  //       return;
  //     }
  //     if (allEmails.includes(googleAuth.email)) {
  //       setEmailError({
  //         iserror: true,
  //         error: "This Google email is already registered",
  //       });
  //       const goToLogin = window.confirm(
  //         "Your Google Email is already registered. Do you want to go to Login?"
  //       );
  //       if (goToLogin) {
  //         router.push("/login");
  //       } else {
  //         setGoogleAuth({ name: "", email: "", image: "" });
  //       }
  //       return;
  //     }
  //     setIsLoadingGoogle(true);
  //     try {
  //       const registered = await registerUser({
  //         name: googleAuth.name || "Google User",
  //         email: googleAuth.email,
  //         password: "google-authenticated",
  //         phone: "Phone",
  //         photo: "",
  //         bio: "Bio",
  //         paymentType: "Free",
  //         comment: [{ initial: "f1", comment: "", stars: 0 }],
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         isAdmin: false,
  //         absenceFaculty: "",
  //       });
  //       if (registered) {
  //         router.push("/login");
  //       }
  //     } catch (error) {
  //       console.error("Google registration failed:", error);
  //       if (error.message.includes("E11000")) {
  //         setEmailError({
  //           iserror: true,
  //           error: "This Google email is already registered",
  //         });
  //         const goToLogin = window.confirm(
  //           "Your Google Email is already registered. Do you want to go to Login?"
  //         );
  //         if (goToLogin) {
  //           router.push("/login");
  //         } else {
  //           setGoogleAuth({ name: "", email: "", image: "" });
  //         }
  //       } else {
  //         setEmailError({
  //           iserror: true,
  //           error: "Registration failed. Please try again.",
  //         });
  //       }
  //     } finally {
  //       setIsLoadingGoogle(false);
  //     }
  //   };
  //   registerGoogleUser();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [googleAuth.email, allEmails, router, setGoogleAuth]);

  // Handle Google sign-in
  // const handleGoogleSignIn = async () => {
  //   if (!googleAuth.email && !isLoadingGoogle) {
  //     await signInWithGoogle();
  //   }
  // };

  // Validate password
  useEffect(() => {
    if (password.length < 8) {
      setPasswordError({
        iserror: true,
        error: "Your password must be at least 8 characters",
      });
    } else {
      setPasswordError({ ...passwordError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  // Check form validity
  useEffect(() => {
    setNoError(
      !nameError.iserror && !emailError.iserror && !passwordError.iserror
    );
  }, [emailError.iserror, nameError.iserror, passwordError.iserror]);

  // Handle form submission
  const submitForm = async () => {
    if (noError) {
      const sureSubmit = confirm("Are you sure to Register?");
      if (sureSubmit) {
        setIsLoading(true);
        try {
          const registered = await registerUser({
            name: name,
            email: email,
            password: password,
            phone: "Phone",
            photo: "",
            bio: "Bio",
            paymentType: "Free",
            comment: [{ initial: "f1", comment: "", stars: 0 }],
            createdAt: new Date(),
            updatedAt: new Date(),
            isAdmin: false,
            absenceFaculty: "",
          });
          if (registered) {
            router.push("/login");
          }
        } catch (error) {
          console.error("Registration failed:", error);
          if (error.message.includes("E11000")) {
            setEmailError({
              iserror: true,
              error: "This email is already registered",
            });
          }
        } finally {
          setIsLoading(false);
        }
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
        className={`p-10 overflow-hidden rounded-lg sm:my-[5%] sm:w-[80%] sm:mx-[10%] lg:w-[700px] xl:w-[800px] 2xl:w-[900px] lg:my-0 text-center shadow-lg ${
          theme ? "bg-[#ececec] text-[#0a0a0a]" : "bg-[#0f0f0f] text-[#f0f0f0]"
        }`}
      >
        <div className={"w-full overflow-hidden"}>
          <div className="text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] xl:text-[40px] 2xl:text-[45px] font-bold mb-8 w-full float-left flex justify-center items-center">
            Registration
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
        </div>

        <div className="w-full sm:hidden block overflow-hidden">
          <EachField
            label="Name"
            type="name"
            name="name"
            isReal={true}
            placeholder="Enter your name"
            value={name}
            setValue={setName}
            iserror={nameError.iserror}
            error={nameError.error}
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
          <button
            onClick={submitForm}
            className={`text-[18px] cursor-pointer rounded-md mt-10 py-2 px-6 shadow-md ${
              noError
                ? "bg-green-800 hover:bg-green-700 text-white"
                : theme
                ? "bg-[#dbdbdb] text-[#808080]"
                : "bg-[#1a1a1a] text-[#696969]"
            }`}
          >
            {isLoading ? `Registering...` : `Register`}
          </button>
        </div>

        <div
          className={`float-left w-[50%] sm:block hidden overflow-hidden pr-5`}
        >
          <EachField
            label="Name"
            type="name"
            name="name"
            isReal={true}
            placeholder="Enter your name"
            value={name}
            setValue={setName}
            iserror={nameError.iserror}
            error={nameError.error}
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
        </div>

        <div
          className={`float-left w-[50%] sm:block hidden overflow-hidden pl-5`}
        >
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
          <button
            onClick={submitForm}
            className={`text-[18px] cursor-pointer rounded-md mt-10 py-2 px-6 ${
              noError
                ? "bg-green-800 hover:bg-green-700 text-white"
                : theme
                ? "bg-[#dbdbdb] text-[#808080]"
                : "bg-[#1a1a1a] text-[#696969]"
            }`}
          >
            {isLoading ? `Registering...` : `Register`}
          </button>
        </div>
        <div
          className={
            "float-left w-full overflow-hidden flex items-center justify-center"
          }
        >
          {/* Google Sign In */}
          {/* <button
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
              <div>
                {isLoadingGoogle ? `Registering...` : `Sign in with Google`}
              </div>
            </div>
          </button> */}
        </div>
        <div className={"float-left w-full overflow-hidden"}>
          <p className="mt-10 text-[16px] xl:text-[20px] 2xl:text-[26px]">
            Already Have An Account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
