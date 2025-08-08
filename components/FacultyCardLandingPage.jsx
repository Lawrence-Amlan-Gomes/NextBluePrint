"use client";
import { useTheme } from "@/app/hooks/useTheme";
import Link from "next/link";
import { useFaculty } from "@/app/hooks/usefaculty";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

export default function FacultyCardLandingPage({
  filteredFaculties,
  faculty,
  setClicked,
}) {
  const { theme } = useTheme();
  const { setFaculty } = useFaculty();

  return (
    <div
      onClick={(e) => {
        if (filteredFaculties.length > 0) {
          setFaculty(faculty);
          setClicked(true);
        }
      }}
    >
      {faculty.name != "animate" ? (
        <div
          className={`rounded-lg shadow-lg sm:p-4 p-2 flex text-center flex-col items-center cursor-pointer transition-colors duration-200 h-full ${
            theme
              ? "bg-[#ececec] text-[#0a0a0a] border border-zinc-300 hover:bg-[#d5d5d5] hover:border-blue-700"
              : "bg-[#1a1a1a] text-[#f0f0f0] border border-zinc-700 hover:bg-[#333333] hover:border-blue-700"
          }`}
        >
          <div className="w-[120px] h-[140px] sm:w-[130px] sm:h-[130px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] xl:w-[180px] xl:h-[180px] rounded-lg overflow-hidden flex items-center justify-center sm:mb-4 mb-2">
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
          <h3 className="font-semibold sm:mb-2 mb-1 text-[12px] sm:text-[16px] w-[120px] sm:w-[130px] md:w-[120px] lg:w-[140px] xl:w-[180px]">
            {faculty.name || "Unknown"}
          </h3>
          <p className="sm:mb-2 mb-1 text-[12px] sm:text-[16px] w-[120px] sm:w-[130px] md:w-[120px] lg:w-[140px] xl:w-[180px]">
            {faculty.initial}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-lg shadow-lg sm:p-4 p-2 flex text-center flex-col items-center cursor-pointer transition-colors duration-200 h-full ${
            theme
              ? "bg-[#ececec] text-[#0a0a0a] border border-zinc-300 hover:bg-[#d5d5d5] hover:border-blue-700"
              : "bg-[#1a1a1a] text-[#f0f0f0] border border-zinc-700 hover:bg-[#333333] hover:border-blue-700"
          }`}
        >
          <motion.div
            className="w-[120px] h-[140px] sm:w-[130px] sm:h-[130px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] xl:w-[180px] xl:h-[180px] rounded-lg overflow-hidden flex items-center justify-center sm:mb-4 mb-2"
            animate={{
              // opacity: [0.5, 1, 0.5],
              backgroundColor: theme
                ? ["#d5d5d5", "#aaaaaa", "#d5d5d5"]
                : ["#333333", "#777777", "#333333"],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className={`w-full h-full ${
                theme ? "text-[#0a0a0a]" : "text-[#f0f0f0]"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </motion.div>
          <motion.h3
            className={`font-semibold h-[25px] w-[120px] sm:w-[130px] md:w-[120px] lg:w-[140px] xl:w-[180px] rounded-md sm:mb-2 mb-1 ${
              theme ? "text-[#0a0a0a]" : "text-[#f0f0f0]"
            }`}
            animate={{
              // opacity: [0.5, 1, 0.5],
              backgroundColor: theme
                ? ["#d5d5d5", "#aaaaaa", "#d5d5d5"]
                : ["#333333", "#777777", "#333333"],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          ></motion.h3>
          <motion.p
            className={`sm:mb-2 mb-1 h-[25px] w-[120px] sm:w-[130px] md:w-[120px] lg:w-[140px] xl:w-[180px] rounded-md ${
              theme ? "text-[#0a0a0a]" : "text-[#f0f0f0]"
            }`}
            animate={{
              // opacity: [0.5, 1, 0.5],
              backgroundColor: theme
                ? ["#d5d5d5", "#aaaaaa", "#d5d5d5"]
                : ["#333333", "#777777", "#333333"],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          ></motion.p>
        </div>
      )}
    </div>
  );
}
