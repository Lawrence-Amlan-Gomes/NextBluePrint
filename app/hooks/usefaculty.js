import { FacultyContext } from "../contexts";
import { useContext } from "react";

export const useFaculty = () => {
  const {
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
  } = useContext(FacultyContext);
  return {
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
  };
};
