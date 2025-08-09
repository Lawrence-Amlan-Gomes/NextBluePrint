"use client";
import Image from "next/image";
import homeIconDark from "../public/HomeIconDark.png";
import homeIconLight from "../public/HomeIconLight.png";
import editIconDark from "../public/editIconDark.png";
import editIconLight from "../public/editIconLight.png";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";
import { useTheme } from "@/app/hooks/useTheme.js";
import ToogleTheme from "./ToogleTheme";
import { useAuth } from "@/app/hooks/useAuth";

const Navbar = () => {
  const { theme } = useTheme();
  const { auth } = useAuth();

  return (
    <div
      className={`sm:h-[100%] h-[8%] sm:w-[7%] w-full float-left overflow-hidden sm:pt-5 ${
        theme ? "bg-blue-700" : "bg-blue-950"
      }`}
    >
      <div className="sm:w-full h-full w-[25%] sm:h-[10%] float-left flex justify-center items-center">
        <Link href="/">
          <div className="flex justify-center items-center h-full">
            <div
              className={`rounded-full lg:h-[40px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                theme
                  ? "bg-[#dddddd] hover:bg-[#eeeeee] text-black"
                  : "bg-[#111111] hover:bg-[#000000] text-white"
              }`}
            >
              <div className="h-full w-full relative">
                <Image
                  priority
                  src={theme ? homeIconLight : homeIconDark}
                  alt={theme ? "home Icon Light" : "home Icon Dark"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="sm:w-full sm:h-[10%] h-full w-[25%] float-left flex justify-center items-center">
        <ToogleTheme />
      </div>
      <div className="sm:w-full sm:h-[10%] h-full w-[25%] float-left flex justify-center items-center">
        <ProfileIcon />
      </div>
      {auth && auth.isAdmin && (
        <Link href="/editFaculty">
          <div className="sm:w-full sm:h-[10%] h-full w-[25%] float-left flex justify-center items-center">
            <div
              className={`rounded-full lg:h-[40px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                theme
                  ? "bg-[#b8b8b8] hover:bg-[#b2b2b2] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#272727] text-zinc-300"
              }`}
            >
              <div className="h-full w-full relative">
                <Image
                  priority
                  src={theme ? editIconLight : editIconDark}
                  alt={theme ? "edit Icon Light" : "edit Icon Dark"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
