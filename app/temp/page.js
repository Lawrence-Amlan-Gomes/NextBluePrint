"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const handleButtonClick = () => {
    if (session && session.user?.email) {
      console.log("User Email:", session.user.email);
    } else {
      signIn("google");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Google Email Logger</h1>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {session ? "Log Email to Console" : "Sign in with Google"}
      </button>
      {session && session.user?.email && (
        <p className="mt-2 text-gray-600">Logged in as: {session.user.email}</p>
      )}
      {session && (
        <button
          onClick={() => signOut()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}