import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from "next/headers"; // <-- ADD THIS IMPORT
// import { getTheme } from "@/app/actions/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MTech Distributors",
  description: "MTech Distributors",
  icons: {
    icon: "/logo.png",
  },
};

export async function getTheme(): Promise<"light" | "dark"> {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value as "light" | "dark" | undefined;
  return theme || "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getTheme();

  return (
    <html lang="en" className={initialTheme} suppressHydrationWarning>
      {/* 
        `suppressHydrationWarning` is recommended on the <html> tag when you dynamically
        set its className on the server, as the client might initially render
        something different before hydration.
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#0B0119] dark:text-gray-200 bg-white text-[#2C3551] `}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
