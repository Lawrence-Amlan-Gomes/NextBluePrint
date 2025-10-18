"use client";

import { FaArrowAltCircleUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/hooks/useTheme";

export default function PromptInput({
  myText,
  setMyText,
  getResponse,
  setIsTyping,
  aiResponse,
}) {
  const [iAmThinking, setIAmThinking] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIAmThinking(false);
  }, [aiResponse]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (myText !== "") {
        setIAmThinking(true);
        getResponse();
      }
    }
  };

  return (
    <div
      className={`relative sm:w-[96%] sm:h-[96%] h-full w-full sm:m-[2%] overflow-hidden p-[1%] border-[1px] rounded-2xl ${
        theme
          ? "bg-[#f8f8f8] border-[#333333]"
          : "bg-[#0f0f0f] border-[#444444]"
      }`}
    >
      <textarea
        className={`w-full h-full text-[15px] sm:text-[18px] 2xl:text-[30px] px-[3%] sm:px-[2%] py-[1%] rounded-2xl resize-none overflow-y-auto outline-none sm:scrollbar-thin ${
          theme
            ? "bg-[#f8f8f8] text-black placeholder:text-[#666666] scrollbar-thumb-[#222222] scrollbar-track-[#f8f8f8]"
            : "bg-[#0f0f0f] text-[#eeeeee] placeholder:text-[#888888] scrollbar-thumb-[#eeeeee] scrollbar-track-[#0f0f0f]"
        }`}
        placeholder={
          iAmThinking ? "I am thinking..." : "How can I help you today?"
        }
        value={myText}
        onChange={(e) => {
          setMyText(e.target.value);
          setIsTyping(true);
        }}
        onKeyDown={handleKeyDown}
      ></textarea>
      <FaArrowAltCircleUp
        onClick={() => {
          if (myText !== "") {
            setIAmThinking(true);
            getResponse();
          }
        }}
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-6 bg-white cursor-pointer hover:text-white hover:border-black hover:border-[1px] hover:bg-black text-black border border-white rounded-full sm:text-[30px] text-[20px]"
      />
    </div>
  );
}