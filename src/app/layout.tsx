import type { Metadata } from "next";
import { Outfit, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthListener } from "@/components/AuthListener";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MuscleMap",
  description: "Your ultimate fitness, workout & muscle companion",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MuscleMap",
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
      className={`${outfit.variable} ${hindSiliguri.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-foreground" suppressHydrationWarning>
        <LanguageProvider>
          <AuthListener />
          <div className="flex-1 mx-auto w-full max-w-[430px] bg-background relative shadow-2xl flex flex-col min-h-screen">
            <main className="flex-1 pb-16">
              {children}
            </main>
            <BottomNav />
            <Toaster
              theme="dark"
              richColors
              position="top-center"
              toastOptions={{
                style: { fontFamily: 'var(--font-sans), var(--font-bengali), sans-serif' },
              }}
            />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
