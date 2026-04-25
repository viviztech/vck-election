import HistoryHero from "@/components/public/history/HistoryHero";
import TimelineSection from "@/components/public/history/TimelineSection";

export const metadata = {
  title: "வரலாறு | விடுதலைச் சிறுத்தைகள் கட்சி",
  description:
    "34 ஆண்டுகள் போராட்டம் — இயக்கத்திலிருந்து மாநிலக் கட்சி வரை விசியின் பயணம்.",
};

export default function HistoryPage() {
  return (
    <>
      <HistoryHero />
      <TimelineSection />
    </>
  );
}
