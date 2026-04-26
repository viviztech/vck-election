import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import LenisProvider from "@/components/public/motion/LenisProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <div lang="ta" className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
