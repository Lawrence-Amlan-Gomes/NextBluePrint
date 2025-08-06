"use client";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/hooks/useTheme";
import { usePathname } from "next/navigation";
import profileIconDark from "../public/profileIconDark.png";
import profileIconLight from "../public/profileIconLight.png";
import Image from "next/image";

const ProfileIcon = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { auth } = useAuth();
  const handleClick = () => {};

  return (
    <div>
      {auth ? (
        <Link href="/profile">
          <div
            className={`sm:w-[40px] sm:h-[40px] h-[30px] w-[30px] rounded-full  ${
              theme
                ? "bg-[#b8b8b8] hover:bg-[#b2b2b2] text-black"
                : "bg-[#1f1f1f] hover:bg-[#272727] text-zinc-300"
            } relative overflow-hidden`}
            onClick={handleClick}
          >
            {auth.photo == "" ? (
              <div className="w-full h-full flex justify-center items-center sm:text-[25px] text-[18px] font-bold">
                <div className="cursor-pointer">
                  {auth.name != undefined ? auth.name.charAt(0) : ""}
                </div>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={auth.photo} alt="profilepic" width="100%"></img>
            )}
          </div>
        </Link>
      ) : (
        <Link href={pathname == "/login" ? "/register" : "/login"}>
          <div className="flex justify-center items-center h-full">
            <div
              className={`rounded-full  lg:h-[40px] shadow-md lg:w-[40px] w-[35px] h-[35px] relative ${
                theme
                  ? "bg-[#b8b8b8] hover:bg-[#b2b2b2] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#272727] text-zinc-300"
              }`}
            >
              <div className="h-full w-full relative">
                {" "}
                <Image
                  priority
                  src={theme ? profileIconLight : profileIconDark}
                  alt={theme ? "Proflie Icon Light" : "Proflie Icon Dark"}
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

export default ProfileIcon;
