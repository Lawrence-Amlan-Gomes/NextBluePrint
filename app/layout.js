import { Roboto } from "next/font/google"; // Import Roboto instead of Inter
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "./providers/AuthProvider";
import { SessionProvider } from "next-auth/react";
import { dbConnect } from "@/services/mongo";
import ThemeProvider from "./providers/ThemeProvider";
import FacultyProvider from "./providers/FacultyProvider";

// Initialize Roboto with desired subsets and weights
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Specify weights you need
  style: ["normal", "italic"], // Optional: include italic if needed
  display: "swap", // Improves loading performance
});

export const metadata = {
  title: "Bracu Faculty Review",
  description: "Improve a person's life with a healthy lifestyle",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  return (
    <html lang="en">
      <body className={roboto.className}> {/* Apply Roboto to the body */}
        <SessionProvider>
          <ThemeProvider>
            <FacultyProvider>
              <AuthProvider>
                <div className="h-screen overflow-hidden w-full">
                  <Navbar />
                  <div className="sm:h-[100%] h-[92%] sm:w-[93%] w-full float-left overflow-hidden">
                    {children}
                  </div>
                </div>
              </AuthProvider>
            </FacultyProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}