"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { useFaculty } from "@/app/hooks/usefaculty";
import { useTheme } from "@/app/hooks/useTheme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FacultyCardLandingPage from "./FacultyCardLandingPage";
import FacultyDetails from "./FacultyDetails";
import landingFaculties from "@/app/landingFaculties/landingFaculties";

export default function LandingPage() {
  const { theme } = useTheme();
  const { auth } = useAuth();
  const {
    faculties,
    filteredFaculties,
    setFilteredFaculties,
  } = useFaculty();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [clicked, setClicked] = useState(false);

  console.log(landingFaculties);

  useEffect(() => {
    const filtered = landingFaculties.filter(
      (faculty) =>
        faculty.initial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaculties(filtered);
  }, [searchQuery, faculties, setFilteredFaculties]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return !clicked ? (
    <div
      className={`w-full h-full ${
        theme
          ? "bg-[#ffffff] text-[#0a0a0a]"
          : "bg-[#000000] text-[#ebebeb] relative"
      }`}
    >
      <div className="relative h-full w-full">
        <div
          className={`w-full h-[10%] flex items-center justify-center gap-4 sm:px-6 p-2 ${
            theme
              ? "bg-[#ffffff] text-[#0a0a0a]"
              : "bg-[#000000] text-[#ebebeb]"
          }`}
        >
          <h1 className="font-bold text-[12px] md:text-[25px] 2xl:text-[40px] sm:mr-10">
            Bracu Faculty Review
          </h1>
          <input
            type="text"
            placeholder="Search by initials or name..."
            value={searchQuery}
            onChange={handleSearch}
            className={`p-2 rounded-md placeholder:text-[#838383] text-[12px] md:text-[20px] border-2 w-[250px] md:w-[300px] ${
              theme
                ? "bg-[#f5f5f5] text-[#0a0a0a] border-[#cccccc]"
                : "bg-[#1a1a1a] text-[#ebebeb] border-[#444444]"
            } focus:outline-none focus:border-blue-700`}
          />
        </div>
        <div className="h-[90%] float-left w-full overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2 p-2 sm:gap-6 sm:p-6 items-stretch">
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map((faculty) => (
                <FacultyCardLandingPage
                  filteredFaculties={filteredFaculties}
                  key={faculty.initial}
                  faculty={faculty}
                  setClicked={setClicked}
                />
              ))
            ) : searchQuery ? (
              <div className="col-span-full text-center text-[25px] sm:text-[40px] text-blue-600">
                No faculties found matching your search.
              </div>
            ) : <></>}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`w-full h-full ${
        theme
          ? "bg-[#ffffff] text-[#0a0a0a]"
          : "bg-[#000000] text-[#ebebeb] relative"
      }`}
    >
      <FacultyDetails setClicked={setClicked} />
    </div>
  );
}
