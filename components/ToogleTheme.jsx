"use client";
import { useTheme } from "@/app/hooks/useTheme";
import sun from "../public/Sun.png";
import moon from "../public/Moon.png";
import Image from "next/image";

function ToogleTheme() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`rounded-full  lg:h-[40px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
          theme
            ? "bg-[#dddddd] hover:bg-[#eeeeee] text-black"
            : "bg-[#111111] hover:bg-[#000000] text-white"
        }`}
        onClick={() => setTheme((prev) => !prev)}
      >
        <div className="h-full w-full relative">
          {" "}
          <Image
            priority
            src={theme ? moon : sun}
            alt={theme ? "moon" : "sun"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default ToogleTheme;
