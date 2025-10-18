"use client";
import Image from "next/image";
import homeIconDark from "../public/HomeIconDark.png";
import homeIconLight from "../public/HomeIconLight.png";
import editIconDark from "../public/editIconDark.png";
import editIconLight from "../public/editIconLight.png";
import dollarIconLight from "../public/dollarIconLight.png";
import dollarIconDark from "../public/dollarIconDark.png";
import openIconLight from "../public/openIconLight.png";
import openIconDark from "../public/openIconDark.png";
import closeIconLight from "../public/closeIconLight.png";
import closeIconDark from "../public/closeIconDark.png";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";
import { useTheme } from "@/app/hooks/useTheme.js";
import ToogleTheme from "./ToogleTheme";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"; // Import framer-motion
import colors from "@/app/color/color";

const TopNavbar = () => {
  const { theme, sidebarOpen } = useTheme();
  const { auth } = useAuth();
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const name = pathname.split("/").filter(Boolean)[0] || "home";
  useEffect(() => {
    if (name) {
      console.log(name);
      if (name === "chat") {
        setActive("chat");
      }
    }
  }, [name]);
  return (
    <>
      <div
        className={`h-[10%] sm:block hidden overflow-hidden ${
          theme
            ? "bg-[#dddddd] border-[#cccccc] border-b-[1px]"
            : "bg-[#0a0a0a] border-[#222222] border-b-[1px]"
        }`}
      >
        <div className="w-[20%] ml-[5%] h-full float-left flex justify-start items-center">
          <Link href="/">
            <div
              className={`text-[15px] sm:text-[18px] md:text-[22px] lg:text-[25px] xl:text-[30px] 2xl:text-[35px] font-bold text-left ${
                theme ? "text-[#222222]" : "text-[#dadada]"
              }`}
            >
              App Name
            </div>
          </Link>
        </div>
        <div className="h-full float-left flex justify-end items-center w-[70%] mr-[5%]">
          {/* Theme Toggle */}
          <div
            className={`sm:w-full sm:h-[10%] h-full w-[25%] float-left flex ${
              sidebarOpen ? "justify-start pl-4" : "justify-center"
            } items-center`}
          >
            <ToogleTheme />
            <span
              className={`ml-3 text-base font-medium ${
                theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
              }`}
            >
              Theme
            </span>
          </div>

          {/* Profile Icon */}
          <div
            className={`sm:w-full sm:h-[10%] h-full w-[25%] float-left flex ${
              sidebarOpen ? "justify-start pl-4" : "justify-center"
            } items-center`}
            onClick={() => setActive("profile")}
          >
            <div className="flex items-center h-full">
              <ProfileIcon active={active} />
              <Link href={auth ? "/profile" : "/login"}>
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${active === "profile" ? `text-blue-700` : ""}`}
                >
                  {auth ? "Profile" : "Login"}
                </span>
              </Link>
            </div>
          </div>

          {/* Chat Link */}
          <div
            className={`sm:w-full h-full w-[25%] sm:h-[10%] float-left flex ${
              sidebarOpen ? "justify-start pl-4" : "justify-center"
            } items-center`}
          >
            <Link href="/chat">
              <div
                className="flex items-center h-full"
                onClick={() => setActive("chat")}
              >
                <div
                  className={`rounded-full lg:h-[40px] border-[2px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                    theme
                      ? active === "chat"
                        ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                        : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                      : active === "chat"
                      ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                      : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
                  }`}
                >
                  <Image
                    priority
                    src={theme ? editIconLight : editIconDark}
                    alt={theme ? "Chat Icon Light" : "Chat Icon Dark"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${active === "chat" ? "text-blue-700" : ""}`}
                >
                  Chat
                </span>
              </div>
            </Link>
          </div>

          {/* Pricing Link */}
          <div
            className={`sm:w-full h-full w-[25%] sm:h-[10%] float-left flex ${
              sidebarOpen ? "justify-start pl-4" : "justify-center"
            } items-center`}
          >
            <Link href="/payment">
              <div
                className="flex items-center h-full"
                onClick={() => setActive("pricing")}
              >
                <div
                  className={`rounded-full lg:h-[40px] border-[2px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                    theme
                      ? active === "pricing"
                        ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                        : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                      : active === "pricing"
                      ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                      : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
                  }`}
                >
                  <Image
                    priority
                    src={theme ? dollarIconLight : dollarIconDark}
                    alt={theme ? "Pricing Icon Light" : "Pricing Icon Dark"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${active === "pricing" ? `text-blue-700` : ""}`}
                >
                  Pricing
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Responsive */}
      <div
        className={`h-[10%] w-full sm:hidden sm:h-0 sm:w-0 flex justify-between items-center border-b-[1px] ${
          theme
            ? "bg-[#dddddd] border-[#cccccc]"
            : "bg-[#0a0a0a] border-[#222222]"
        }`}
      >
        {/* Home Link */}
        <div className="flex-1 flex justify-center items-center">
          <Link href="/">
            <div
              className="flex items-center h-full"
              onClick={() => setActive("home")}
            >
              <div
                className={`rounded-full lg:h-[40px] border-[2px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                  theme
                    ? active === "home"
                      ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                      : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                    : active === "home"
                    ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                    : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
                }`}
              >
                <Image
                  priority
                  src={theme ? homeIconLight : homeIconDark}
                  alt={theme ? "Home Icon Light" : "Home Icon Dark"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Theme Toggle */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center h-full">
            <ToogleTheme />
          </div>
        </div>

        {/* Profile Icon */}
        <div className="flex-1 flex justify-center items-center">
          <div
            className="flex items-center h-full"
            onClick={() => setActive("profile")}
          >
            <ProfileIcon active={active} />
          </div>
        </div>

        {/* Chat Link */}
        <div className="flex-1 flex justify-center items-center">
          <Link href="/chat">
            <div
              className="flex items-center h-full"
              onClick={() => setActive("chat")}
            >
              <div
                className={`rounded-full h-[30px] w-[30px] border-[2px] relative ${
                  theme
                    ? active === "chat"
                      ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                      : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                    : active === "chat"
                    ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                    : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
                }`}
              >
                <Image
                  priority
                  src={theme ? editIconLight : editIconDark}
                  alt={theme ? "Chat Icon Light" : "Chat Icon Dark"}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Pricing Link */}
        <div className="flex-1 flex justify-center items-center">
          <Link href="/payment">
            <div
              className="flex items-center h-full"
              onClick={() => setActive("pricing")}
            >
              <div
                className={`rounded-full h-[30px] w-[30px] border-[2px] relative ${
                  theme
                    ? active === "pricing"
                      ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                      : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                    : active === "pricing"
                    ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                    : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
                }`}
              >
                <Image
                  priority
                  src={theme ? dollarIconLight : dollarIconDark}
                  alt={theme ? "Pricing Icon Light" : "Pricing Icon Dark"}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
