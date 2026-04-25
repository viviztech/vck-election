import type { Metadata } from "next";
import { Geist, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "விடுதலைச் சிறுத்தைகள் கட்சி",
  description: "விடுதலைச் சிறுத்தைகள் கட்சி — சாதி ஒழிப்பு, சமூக நீதி, தமிழ் தேசியம்",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${geistSans.variable} ${notoSerifTamil.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
