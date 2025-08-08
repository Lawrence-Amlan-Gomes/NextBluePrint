import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "./providers/AuthProvider";
import { SessionProvider } from "next-auth/react";

import { dbConnect } from "@/services/mongo";
import ThemeProvider from "./providers/ThemeProvider";
import FacultyProvider from "./providers/FacultyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bracu Faculty Review",
  description: "Improve a person's life with a healthy lifestyle",
};

export default async function RootLayout({ children }) {
  await dbConnect();
  return (
    <html lang="en">
      <body>
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
          </ThemeProvider>{" "}
        </SessionProvider>
      </body>
    </html>
  );
}
