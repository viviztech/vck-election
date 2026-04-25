import WingsHero from "@/components/public/wings/WingsHero";
import WingsGrid from "@/components/public/wings/WingsGrid";

export const metadata = {
  title: "கட்சி அணிகள் | விசி",
};

export default function PartyWingsPage() {
  return (
    <>
      <WingsHero />
      <WingsGrid />
    </>
  );
}
