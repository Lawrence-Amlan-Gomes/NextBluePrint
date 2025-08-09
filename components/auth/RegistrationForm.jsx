"use client";
import { registerUser } from "@/app/actions";
import colors from "@/app/color/color";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/hooks/useTheme";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [department, setDepartment] = useState("");
  const [departmentError, setDepartmentError] = useState({
    iserror: true,
    error: "Department is required",
  });
  const [studentId, setStudentId] = useState("");
  const [studentIdError, setStudentIdError] = useState({
    iserror: true,
    error: "Student ID is required",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    iserror: true,
    error: "Confirm password is required",
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
    } else if (email.slice(-14) !== "@g.bracu.ac.bd") {
      setEmailError({
        iserror: true,
        error: "Use @g.bracu.ac.bd as your email format",
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

  // Validate department
  useEffect(() => {
    if (department === "") {
      setDepartmentError({ iserror: true, error: "Department is required" });
    } else {
      setDepartmentError({ ...departmentError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  // Validate student ID
  useEffect(() => {
    if (studentId === "") {
      setStudentIdError({ iserror: true, error: "Student ID is required" });
    } else if (!/^\d+$/.test(studentId)) {
      setStudentIdError({
        iserror: true,
        error: "Student ID must be a number",
      });
    } else {
      setStudentIdError({ ...studentIdError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // Validate confirm password
  useEffect(() => {
    if (confirmPassword === "") {
      setConfirmPasswordError({
        iserror: true,
        error: "Confirm password is required",
      });
    } else if (confirmPassword !== password) {
      setConfirmPasswordError({
        iserror: true,
        error: "Confirm password must match password",
      });
    } else {
      setConfirmPasswordError({ ...confirmPasswordError, iserror: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword, password]);

  // Check form validity
  useEffect(() => {
    setNoError(
      !nameError.iserror &&
        !emailError.iserror &&
        !passwordError.iserror &&
        !departmentError.iserror &&
        !studentIdError.iserror &&
        !confirmPasswordError.iserror
    );
  }, [
    nameError.iserror,
    emailError.iserror,
    passwordError.iserror,
    departmentError.iserror,
    studentIdError.iserror,
    confirmPasswordError.iserror,
  ]);

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
            photo: "",
            paymentType: "Free",
            comment: [{ initial: "f1", comment: "", stars: 0 }],
            createdAt: new Date(),
            updatedAt: new Date(),
            isAdmin: false,
            absenceFaculty: "",
            department: department,
            serial: studentId,
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
        <div className={"w-full overflow-hidden"}>
          <div className="text-[20px] lg:text-[25px] 2xl:text-[40px] font-bold sm:mb-5 w-full float-left flex justify-center items-center">
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
            label="Department"
            type="text"
            name="department"
            isReal={true}
            placeholder="Enter your department"
            value={department}
            setValue={setDepartment}
            iserror={departmentError.iserror}
            error={departmentError.error}
          />
          <EachField
            label="Student ID"
            type="text"
            name="studentId"
            isReal={true}
            placeholder="Enter your student ID"
            value={studentId}
            setValue={setStudentId}
            iserror={studentIdError.iserror}
            error={studentIdError.error}
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
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            isReal={true}
            placeholder="Confirm your password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            iserror={confirmPasswordError.iserror}
            error={confirmPasswordError.error}
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

        <div className={`float-left w-[50%] sm:block hidden pr-5`}>
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
            label="Department"
            type="text"
            name="department"
            isReal={true}
            placeholder="Enter your department"
            value={department}
            setValue={setDepartment}
            iserror={departmentError.iserror}
            error={departmentError.error}
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

        <div className={`float-left w-[50%] sm:block hidden pl-5`}>
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
            label="Student ID"
            type="text"
            name="studentId"
            isReal={true}
            placeholder="Enter your student ID"
            value={studentId}
            setValue={setStudentId}
            iserror={studentIdError.iserror}
            error={studentIdError.error}
          />
          <EachField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            isReal={true}
            placeholder="Confirm your password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            iserror={confirmPasswordError.iserror}
            error={confirmPasswordError.error}
          />
        </div>
        <div className="sm:block hidden w-full overflow-hidden">
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
        <div
          className={
            "float-left w-full overflow-hidden flex items-center justify-center"
          }
        ></div>
        <div className={"float-left w-full overflow-hidden"}>
          <p className="sm:mt-10 mt-5 text-[12px] lg:text-[16px] 2xl:text-[26px]">
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
