"use client";

import { useEffect, useState, useRef } from "react";
import { useResponse } from "@/app/hooks/useResponse";
import { response } from "@/app/server"; // Import the server action
import PromptInput from "./PromptInput";
import EachInputOutput from "./EachInputOutput";
import { useTheme } from "@/app/hooks/useTheme";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Chat() {
  const {
    myText,
    setMyText,
    aiResponse,
    setAiResponse,
    inputOuputPair,
    setInputOutputPair,
  } = useResponse();
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(true);
  const { auth } = useAuth();
  const { theme } = useTheme();
  const [firstTime, setFirstTime] = useState(true);
  const [request, setRequest] = useState(false);
  const [tempMyText, setTempMyText] = useState("");
  const chatRef = useRef(null);
  const bottomRef = useRef(null); // Added to target the bottom of the chat

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getResponse = async () => {
    if (myText !== "") {
      setIsTyping(false);
      setRequest(true);
      setTempMyText(myText);
      // Add the prompt with "loading" state to inputOuputPair
      const tempInputOutputPair = [...inputOuputPair, [myText, "loading"]];
      setInputOutputPair(tempInputOutputPair);
      setMyText("");
      // Scroll to the bottom after adding the new pair with a slight delay
      setTimeout(scrollToBottom, 0);
    }
  };

  useEffect(() => {
    if (!auth) {
      router.push("/login");
    }
  }, [auth, router]);

  useEffect(() => {
    scrollToBottom();
  }, [inputOuputPair]);

  useEffect(() => {
    if (inputOuputPair.length === 0) {
      console.log(inputOuputPair.length);
    } else {
      setFirstTime(false);
    }
  }, [inputOuputPair]);

  useEffect(() => {
    async function fetchData() {
      if (request) {
        try {
          const res = await response(tempMyText, inputOuputPair);
          setAiResponse(res);
          // Update the last pair's response from "loading" to the actual response
          const tempInputOutputPair = [...inputOuputPair];
          tempInputOutputPair[tempInputOutputPair.length - 1] = [tempMyText, res];
          setInputOutputPair(tempInputOutputPair);
        } catch (error) {
          console.error("Error fetching AI response:", error);
          setAiResponse("Could not fetch Ai response, Try again later.");
          // Update the last pair with error message
          const tempInputOutputPair = [...inputOuputPair];
          tempInputOutputPair[tempInputOutputPair.length - 1] = [tempMyText, "Error: Could not fetch response"];
          setInputOutputPair(tempInputOutputPair);
        } finally {
          setRequest(false);
        }
      }
    }
    fetchData();
  }, [request, tempMyText, inputOuputPair, setAiResponse, setInputOutputPair]);

  return firstTime ? (
    <div
      className={`h-full w-full overflow-hidden relative ${
        theme ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-[#000000] text-[#ebebeb]"
      }`}
    >
      <div
        className={`w-[96%] ml-[2%] sm:w-[60%] sm:ml-[20%] flex justify-center relative overflow-hidden items-center h-full ${
          theme ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-[#000000] text-[#ebebeb]"
        }`}
      >
        <div className="w-full overflow-hidden relative">
          <div className="w-full px-[5%] sm:px-0 float-left flex justify-center items-center text-center text-[22px] sm:text-[30px] 2xl:text-[45px] font-bold mb-[20px]">
            Hi, I am an AI Model.
          </div>
          <div className="w-full flex justify-center overflow-hidden relative items-center float-left h-[110px] sm:h-[140px]">
            <PromptInput
              myText={myText}
              setMyText={setMyText}
              getResponse={getResponse}
              setIsTyping={setIsTyping}
              aiResponse={aiResponse}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`h-full w-full relative overflow-hidden ${
        theme ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-[#000000] text-[#ebebeb]"
      }`}
    >
      <div
        ref={chatRef}
        className={`w-full h-full pt-[2%] relative overflow-x-hidden overflow-y-auto scrollbar ${
          theme
            ? "scrollbar-thumb-black scrollbar-track-[#eeeeee]"
            : "scrollbar-thumb-white scrollbar-track-[#222222]"
        }`}
      >
        <div className="h-[95%] sm:px-[20%] relative w-full">
          {inputOuputPair.map((item, index) => (
            <EachInputOutput
              key={index}
              pair={item}
              isLast={index === inputOuputPair.length - 1}
              isLoading={request && index === inputOuputPair.length - 1}
            />
          ))}
          <div className="w-full h-[25%]" ref={bottomRef}></div>
        </div>
      </div>
      <div
        className={`flex justify-center overflow-hidden items-center absolute bottom-0 left-0 w-[98%] sm:h-[25%] h-[120px] pb-0 sm:pb-[2%] ${
          theme ? "bg-white" : "bg-black"
        }`}
      >
        <div className="sm:h-full h-[100px] sm:mt-0 w-full sm:w-[60%] relative ml-[2%] sm:pl-0">
          <PromptInput
            myText={myText}
            setMyText={setMyText}
            getResponse={getResponse}
            setIsTyping={setIsTyping}
            aiResponse={aiResponse}
          />
        </div>
      </div>
    </div>
  );
}