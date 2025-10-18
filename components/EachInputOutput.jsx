"use client";
import { useTheme } from "@/app/hooks/useTheme";
import { motion } from "framer-motion";

export default function EachInputOutput({ pair, isLast, isLoading }) {
  const { theme } = useTheme();

  // Function to process text and make **text** bold
  const renderTextWithBold = (text) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    // Split text into bold and non-bold segments
    while ((match = regex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      const boldText = match[1];
      if (before) parts.push({ text: before, isBold: false });
      parts.push({ text: boldText, isBold: true });
      lastIndex = regex.lastIndex;
    }
    // Add remaining text after the last match
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isBold: false });
    }

    // Render segments as JSX
    return parts.map((part, index) => (
      <span key={index} className={part.isBold ? "font-bold" : ""}>
        {part.text}
      </span>
    ));
  };

  // Typing animation variants
  const typingVariants = {
    animate: {
      opacity: [0, 1, 0],
      transition: {
        opacity: {
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div
        className={`border-[1px] ${
          theme ? "bg-[#f1f1f1] text-black border-black" : "bg-[#222222] text-white border-[#888888]"
        } w-[83%] ml-[15%] text-justify py-3 px-5 rounded-md sm:mb-3 bg-1 mr-[2%] text-[15px] sm:text-[18px] 2xl:text-[27px]`}
      >
        {renderTextWithBold(pair[0])}
      </div>
      <div
        className={`w-[88%] mr-[10%] ml-[2%] ${
          theme ? "text-black" : "text-white"
        } text-justify pt-3 px-5 rounded-md mb-8 text-[15px] sm:text-[18px] 2xl:text-[27px]`}
      >
        {isLast && isLoading ? (
          <motion.div
            className="flex items-center space-x-2"
            variants={typingVariants}
            animate="animate"
          >
            <motion.span className="inline-block w-2 h-2 bg-current rounded-full"></motion.span>
            <motion.span className="inline-block w-2 h-2 bg-current rounded-full"></motion.span>
            <motion.span className="inline-block w-2 h-2 bg-current rounded-full"></motion.span>
          </motion.div>
        ) : (
          pair[1].split("[/n]").map((paragraph, index) => (
            <p key={index} className="sm:mb-3 bg-1">
              {renderTextWithBold(paragraph)}
            </p>
          ))
        )}
      </div>
    </div>
  );
}