"use client";

import { useState } from "react";

import { FacultyContext } from "../contexts";

export default function FacultyProvider({ children }) {
  const [faculty, setFaculty] = useState({});
  const [allFacultyComment, setAllFacultyComment] = useState([]);
  const [allFacultyRating, setAllFacultyRating] = useState([]);
  const [firstTime, setFirstTime] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);

  return (
    <FacultyContext.Provider
      value={{
        faculty,
        setFaculty,
        allFacultyComment,
        setAllFacultyComment,
        allFacultyRating,
        setAllFacultyRating,
        firstTime,
        setFirstTime,
        faculties,
        setFaculties,
        filteredFaculties,
        setFilteredFaculties,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
}
