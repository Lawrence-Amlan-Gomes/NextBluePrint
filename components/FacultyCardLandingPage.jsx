"use client";
import { useTheme } from "@/app/hooks/useTheme";
import Link from "next/link";
import { useFaculty } from "@/app/hooks/usefaculty";
import StarRating from "./StarRating";

export default function FacultyCardLandingPage({ faculty, setClicked }) {
  const { theme } = useTheme();
  const { setFaculty } = useFaculty();

  return (
    <div
      onClick={(e) => {
        setFaculty(faculty);
        setClicked(true);
      }}
    >
      <div
        className={`rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer transition-colors duration-200 ${
          theme
            ? "bg-[#ececec] text-[#0a0a0a] border border-zinc-300 hover:bg-[#d5d5d5] hover:border-blue-700"
            : "bg-[#1a1a1a] text-[#f0f0f0] border border-zinc-700 hover:bg-[#333333] hover:border-blue-700"
        }`}
      >
        <div className="w-[150px] h-[200px] rounded-lg overflow-hidden flex items-center justify-center mb-4">
          {faculty.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faculty.photo}
              alt={`${faculty.name} photo`}
              className="w-full h-full object-cover"
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
        <h3 className="text-lg font-semibold mb-2">
          {faculty.name || "Unknown"}
        </h3>
        <p className="text-sm mb-2">{faculty.initial}</p>
        <p className="text-sm mb-2">{faculty.department}</p>
      </div>
    </div>
  );
}
