import { Roboto } from "next/font/google"; // Import Roboto instead of Inter
import "./globals.css";
import Navbar from "@/components/SideNavbar";
import AuthProvider from "./providers/AuthProvider";
import { SessionProvider } from "next-auth/react";
import { dbConnect } from "@/services/mongo";
import ThemeProvider from "./providers/ThemeProvider";
import TopNavbar from "@/components/TopNavbar";
import SideNavbar from "@/components/SideNavbar";
import ResponseProvider from "./providers/ResponseProvider";
import SideBarHandle from "@/components/SideBarHandle";

// Initialize Roboto with desired subsets and weights
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Specify weights you need
  style: ["normal", "italic"], // Optional: include italic if needed
  display: "swap", // Improves loading performance
});

export const metadata = {
  title: "App Name",
  description: "App Description",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  return (
    <html lang="en">
      <body className={roboto.className}>
        {" "}
        {/* Apply Roboto to the body */}
        <SessionProvider>
          <ResponseProvider>
            <ThemeProvider>
              <AuthProvider>
                <div className="h-screen overflow-hidden w-full">
                  {/* Top Navbar */}
                  {/* <TopNavbar/>
                  <div className="h-[90%] w-full float-left overflow-hidden">
                    {children}
                  </div> */}
                  {/* Side Navbar */}
                  <SideNavbar />
                  <SideBarHandle>{children}</SideBarHandle>
                </div>
              </AuthProvider>
            </ThemeProvider>
          </ResponseProvider>
        </SessionProvider>
      </body>
    </html>
  );
}