import { FacultyContext } from "../contexts";
import { useContext } from "react";

export const useFaculty = () => {
    const {faculty, setFaculty} = useContext(FacultyContext);
    return {faculty, setFaculty};
}