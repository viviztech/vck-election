import type { Metadata } from "next";
import LeadershipHero from "@/components/public/leadership/LeadershipHero";
import LeadershipGrid from "@/components/public/leadership/LeadershipGrid";

export const metadata: Metadata = {
  title: "தலைமை | விசி",
};

export default function LeadershipPage() {
  return (
    <>
      <LeadershipHero />
      <LeadershipGrid />
    </>
  );
}
