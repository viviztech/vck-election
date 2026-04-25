import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/home/Hero";
import FiveBeliefs from "@/components/public/home/FiveBeliefs";
import FlagDecoded from "@/components/public/home/FlagDecoded";
import Representatives from "@/components/public/home/Representatives";
import HistoryTeaser from "@/components/public/home/HistoryTeaser";
import NewsTeaserSection from "@/components/public/home/NewsTeaserSection";
import JoinCTA from "@/components/public/home/JoinCTA";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div lang="en" className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FiveBeliefs />
        <FlagDecoded />
        <Representatives />
        <HistoryTeaser />
        <NewsTeaserSection />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
