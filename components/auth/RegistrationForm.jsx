"use client";

import { registerUser, getAllUsers2 } from "@/app/actions";
import colors from "@/app/color/color";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/hooks/useTheme";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EachField from "./EachField";

async function hashPassword(password, iterations = 10000) {
  try {
    const fixedSalt = "fixedSalt1234567890abcdef";
    const encodedPassword = new TextEncoder().encode(password);
    const encodedSalt = new TextEncoder().encode(fixedSalt);

    const combined = new Uint8Array(
      encodedPassword.length + encodedSalt.length
    );
    combined.set(encodedPassword, 0);
    combined.set(encodedSalt, encodedPassword.length);

    let data = combined;
    for (let i = 0; i < iterations; i++) {
      data = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
    }

    const hash = Array.from(data)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

const RegistrationForm = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { googleAuth, setGoogleAuth } = useAuth();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [noError, setNoError] = useState(false);
  const [nameError, setNameError] = useState({
    iserror: true,
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

  // Fetch all emails for uniqueness check
  useEffect(() => {
    const setAllEmailsInArray = async () => {
      const Emails = [];
      const users = await getAllUsers2({ email: email });
      for (let user of users) {
        Emails.push(user.email);
      }
      setAllEmails(Emails);
    };
    setAllEmailsInArray();
  }, [email]);

  // Validate name
  useEffect(() => {
    if (name === "") {
      setNameError({ iserror: true, error: "Name is required" });
    } else {
      setNameError({ iserror: false, error: "" });
    }
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
    } else {
      setEmailError({ iserror: false, error: "" });
    }
  }, [email]);

  // Handle first-time email check with timeout
  useEffect(() => {
    if (firstTimeEmailCheck && allEmails.length > 0 && email !== "") {
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

  // Validate password
  useEffect(() => {
    if (password.length < 8) {
      setPasswordError({
        iserror: true,
        error: "Your password must be at least 8 characters",
      });
    } else {
      setPasswordError({ iserror: false, error: "" });
    }
  }, [password]);

  // Check form validity
  useEffect(() => {
    setNoError(
      !nameError.iserror && !emailError.iserror && !passwordError.iserror
    );
  }, [nameError.iserror, emailError.iserror, passwordError.iserror]);

  // Handle form submission
  const submitForm = async () => {
    if (noError) {
      const sureSubmit = confirm("Are you sure to Register?");
      if (sureSubmit) {
        setIsLoading(true);
        try {
          const hashedPassword = await hashPassword(password);
          const registered = await registerUser({
            name: name,
            email: email,
            password: hashedPassword,
            photo: "",
            paymentType: "Free",
            createdAt: new Date(),
            updatedAt: new Date(),
            isAdmin: false,
            absenceFaculty: "",
            firstTimeLogin: true,
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
        theme
          ? `${colors.bgLight} ${colors.bgLight}`
          : `${colors.bgDark} ${colors.bgDark}`
      }`}
    >
      <div
        className={`sm:p-10 p-5 overflow-hidden rounded-lg sm:my-[5%] sm:w-[80%] sm:mx-[10%] lg:w-[700px] xl:w-[800px] 2xl:w-[900px] lg:my-0 text-center ${
          theme ? `${colors.cardLight}` : `${colors.cardDark}`
        }`}
      >
        <div className="w-full overflow-hidden">
          <div className="text-[20px] lg:text-[25px] 2xl:text-[40px] font-bold sm:mb-5 w-full float-left flex justify-center items-center">
            Registration
          </div>
          {/* Trick the browser with fake email and password fields */}
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
          <button
            onClick={submitForm}
            className={`text-[12px] cursor-pointer rounded-md mt-5 py-2 px-4 ${
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

        <div className="float-left w-[50%] sm:block hidden pr-5">
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
        </div>

        <div className="float-left w-[50%] sm:block hidden pl-5">
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
          <button
            onClick={submitForm}
            className={`text-[12px] lg:text-[16px] 2xl:text-[25px] cursor-pointer rounded-md sm:mt-10 py-2 px-6 ${
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

        <div className="float-left w-full overflow-hidden">
          <p className="sm:mt-10 mt-5 text-[12px] lg:text-[16px] 2xl:text-[26px]">
            Already Have An Account?{" "}
            <Link href="/login" className={`${colors.keyColorText} hover:text-blue-500`}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
