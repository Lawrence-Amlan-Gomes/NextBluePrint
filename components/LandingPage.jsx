"use client";
import { useTheme } from "@/app/hooks/useTheme";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";

export default function LandingPage() {
  const { auth } = useAuth();
  const { theme } = useTheme();

  return (
    <div
      className={`w-full h-full ${
        theme ? "bg-[#ffffff] text-[#0a0a0a]" : "bg-[#000000] text-[#ebebeb]"
      }`}
    >
      <div className="flex justify-center items-center h-full w-full text-[50px] font-bold">
        Next Blue Print
      </div>
    </div>
  );
}
