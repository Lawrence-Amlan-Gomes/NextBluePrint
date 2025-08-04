"use client";

import { useTheme } from "@/app/hooks/useTheme";

export default function Payment() {
  const { theme } = useTheme();
  console.log("Payment component rendered. Theme:", theme);
  return (
    <div
      className={`w-full h-full overflow-y-auto scrollbar ${
        theme
          ? "bg-[#ffffff] text-[#0a0a0a] scrollbar-track-[#eeeeee] scrollbar-thumb-[#333333]"
          : "bg-[#000000] text-[#ebebeb] scrollbar-track-[#222222] scrollbar-thumb-[#eeeeee]"
      }`}
    >
      Payment
    </div>
  );
}
