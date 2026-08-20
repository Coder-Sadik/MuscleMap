import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitTrack Pro",
  description: "Your premium fitness companion",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitTrack Pro",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-foreground">
        <div className="flex-1 mx-auto w-full max-w-[430px] bg-background relative shadow-2xl flex flex-col min-h-screen">
          <main className="flex-1 pb-16">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
