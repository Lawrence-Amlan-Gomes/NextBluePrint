"use client";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/hooks/useTheme";
import { usePathname } from "next/navigation";
import profileIconDark from "../public/profileIconDark.png";
import profileIconLight from "../public/profileIconLight.png";
import Image from "next/image";
import colors from "@/app/color/color";

const ProfileIcon = ({ active }) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { auth } = useAuth();
  const handleClick = () => {};

  return (
    <div>
      {auth ? (
        <Link href="/profile">
          <div
            className={`border-[2px] lg:h-[40px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] rounded-full  ${
              theme
                ? active == "profile"
                  ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                  : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                : active == "profile"
                ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
            } relative overflow-hidden`}
            onClick={handleClick}
          >
            {auth.photo == "" ? (
              <div className="w-full h-full flex justify-center items-center sm:text-[25px] text-[18px] font-bold">
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
              className={`rounded-full border-[2px] lg:h-[40px] lg:w-[40px] sm:w-[35px] sm:h-[35px] h-[30px] w-[30px] relative ${
                theme
                  ? active == "profile"
                    ? `bg-[#dddddd] hover:bg-[#eeeeee] text-black ${colors.keyColorBorder}`
                    : `bg-[#dddddd] hover:bg-[#eeeeee] text-black border-[#333333]`
                  : active == "profile"
                  ? `bg-[#000000] hover:bg-[#222222] text-white ${colors.keyColorBorder}`
                  : `bg-[#000000] hover:bg-[#222222] text-white border-[#999999]`
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
