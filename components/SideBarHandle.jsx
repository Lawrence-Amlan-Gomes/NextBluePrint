"use client";
import { useTheme } from "@/app/hooks/useTheme";
import { motion } from "framer-motion"; // Import framer-motion

export default function SideBarHandle({ children }) {
  const { sidebarOpen } = useTheme();
  return (
    <>
      <motion.div
        className={`sm:h-[100%] hidden sm:block float-left overflow-hidden relative`}
        initial={{ width: sidebarOpen ? "85%" : "95%" }}
        animate={{ width: sidebarOpen ? "85%" : "95%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }} // Sync with SideNavbar
      >
        {children}
      </motion.div>
      <div className="sm:hidden block sm:h-0 sm:w-0 h-[92%] w-full float-left overflow-hidden relative">{children}</div>
    </>
  );
}
