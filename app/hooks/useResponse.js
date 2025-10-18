import { ResponseContext } from "../contexts";
import { useContext } from "react";

export const useResponse = () => {
    const {myText,setMyText,aiResponse,setAiResponse,inputOuputPair, setInputOutputPair} = useContext(ResponseContext);
    return {myText,setMyText,aiResponse,setAiResponse,inputOuputPair, setInputOutputPair};
}