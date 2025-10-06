import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner"
import TanstackProvider from "@/providers/tanstack";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { SanityLive } from "@/utils/sanity/lib/live";
import NavBarNumber from "@/components/home/NavBarNumber";
import Script from "next/script";

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
  description:
    "MTech Distributors - Your Trusted Partner in Technology Solutions",
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
  const phoneNumber = await NavBarNumber();
  return (
    <html lang="en" className={initialTheme} suppressHydrationWarning>
      {/* 
        `suppressHydrationWarning` is recommended on the <html> tag when you dynamically
        set its className on the server, as the client might initially render
        something different before hydration.
      */}
      <head>
        <Script>
          {
            `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NM6HBL86');
            `
          }
        </Script>
        <Script src="https://cdn.gomega.ai/scripts/optimizer.min.js" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#0B0119] dark:text-gray-200 bg-white text-[#2C3551] `}
      >
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NM6HBL86"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
          </noscript>
        <ThemeProvider initialTheme={initialTheme}>
          <AuthProvider>
            <TanstackProvider>
              <Navbar phoneNumber={phoneNumber} />
              {children}
              <SanityLive />
              {(await draftMode()).isEnabled && <VisualEditing />}
              {(await draftMode()).isEnabled && <DisableDraftMode />}
              <Footer />
            </TanstackProvider>
          </AuthProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
