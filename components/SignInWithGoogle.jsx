"use server";
import { signIn, auth } from "../app/auth";
import Image from "next/image";
import googleIcon from "../public/googleIcon.png";

export default async function SignInWithGoogle() {
  const s = await auth();
  console.log(s);
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
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
          <div>Register</div>
        </div>
      </button>
    </form>
  );
}
