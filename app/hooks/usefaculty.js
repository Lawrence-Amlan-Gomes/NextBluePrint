import { FacultyContext } from "../contexts";
import { useContext } from "react";

export const useFaculty = () => {
  const {
    faculty,
    setFaculty,
    allFacultyCommentRating,
    setAllFacultyCommentRating,
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
    allFacultyCommentRating,
    setAllFacultyCommentRating,
    firstTime,
    setFirstTime,
    faculties,
    setFaculties,
    filteredFaculties,
    setFilteredFaculties,
  };
};
