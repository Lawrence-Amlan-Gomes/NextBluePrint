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

const SideNavbar = () => {
  const { theme, sidebarOpen, setSidebarOpen } = useTheme();
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
      <motion.div
        className={`sm:h-[100%] w-0 h-0 sm:block hidden float-left overflow-hidden sm:pt-5 ${
          theme
            ? "bg-[#dddddd] border-[#cccccc] border-r-[1px]"
            : "bg-[#0a0a0a] border-[#222222] border-r-[1px]"
        }`}
        initial={{ width: sidebarOpen ? "15%" : "5%" }}
        animate={{ width: sidebarOpen ? "15%" : "5%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
      >
        {/* Toggle Button */}
        <div
          className={`sm:w-full h-full sm:h-[10%] float-left flex ${
            sidebarOpen ? "justify-start pl-4" : "justify-center"
          } items-center`}
        >
          <button
            className={`rounded-full flex justify-center items-center lg:h-[40px] border-[2px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
              theme
                ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
            }`}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <div className="w-full h-full relative flex items-center">
              <Image
                priority
                src={
                  sidebarOpen
                    ? theme
                      ? closeIconLight
                      : closeIconDark
                    : theme
                    ? openIconLight
                    : openIconDark
                }
                alt={
                  sidebarOpen
                    ? theme
                      ? "Close Icon Light"
                      : "Close Icon Dark"
                    : theme
                    ? "Open Icon Light"
                    : "Open Icon Dark"
                }
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                className="object-cover"
              />
            </div>
          </button>
          {sidebarOpen && (
            <span
              className={`ml-3 text-base font-medium ${
                theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
              }`}
            >
              Close
            </span>
          )}
        </div>

        {/* Home Link */}
        <div
          className={`sm:w-full relative h-full w-[25%] sm:h-[10%] float-left flex ${
            sidebarOpen ? "justify-start pl-4" : "justify-center"
          } items-center`}
        >
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
              {sidebarOpen && (
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${active === "home" && sidebarOpen ? "text-blue-700" : ""}`}
                >
                  Home
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Theme Toggle */}
        <div
          className={`sm:w-full sm:h-[10%] h-full w-[25%] float-left flex ${
            sidebarOpen ? "justify-start pl-4" : "justify-center"
          } items-center`}
        >
          <ToogleTheme />
          {sidebarOpen && (
            <span
              className={`ml-3 text-base font-medium ${
                theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
              }`}
            >
              Theme
            </span>
          )}
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
            {sidebarOpen && (
              <span
                className={`ml-3 text-base font-medium ${
                  theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                } ${
                  active === "profile" && sidebarOpen ? "text-blue-700" : ""
                }`}
              >
                {auth ? "Profile" : "Login"}
              </span>
            )}
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
              {sidebarOpen && (
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${active === "chat" && sidebarOpen ? "text-blue-700" : ""}`}
                >
                  Chat
                </span>
              )}
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
              {sidebarOpen && (
                <span
                  className={`ml-3 text-base font-medium ${
                    theme ? "text-[#0a0a0a]" : "text-[#ebebeb]"
                  } ${
                    active === "pricing" && sidebarOpen ? "text-blue-700" : ""
                  }`}
                >
                  Pricing
                </span>
              )}
            </div>
          </Link>
        </div>
      </motion.div>
      {/* Movile Responsive */}
      <div
        className={`h-[8%] w-full sm:hidden sm:h-0 sm:w-0 flex justify-between items-center border-b-[1px] ${
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

export default SideNavbar;
