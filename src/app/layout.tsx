import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/theme-context";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Localynk – The Heart of Your Neighborhood",
  description: "Connecting local vendors with modern shoppers. The digital bridge for neighborhood micro-commerce.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Localynk",
  },
};

export const viewport: Viewport = {
  themeColor: "#F55744",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <ThemeProvider>
          <div className="app-container">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


