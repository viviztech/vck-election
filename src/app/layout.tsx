import type { Metadata } from "next";
import { Mukta_Malar, Baloo_Thambi_2 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const muktaMalar = Mukta_Malar({
  variable: "--font-body",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const balooThambi2 = Baloo_Thambi_2({
  variable: "--font-heading",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "விடுதலைச் சிறுத்தைகள் கட்சி",
  description: "விடுதலைச் சிறுத்தைகள் கட்சி — சாதி ஒழிப்பு, சமூக நீதி, தமிழ் தேசியம்",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${muktaMalar.variable} ${balooThambi2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
