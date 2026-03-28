import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "விடுதலைச் சிறுத்தைகள் கட்சி",
  description: "விடுதலைச் சிறுத்தைகள் கட்சி — உறுப்பினர் படிவ நிர்வாக அமைப்பு",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
