import IdeologyHero from "@/components/public/ideology/IdeologyHero";
import CoreStatements from "@/components/public/ideology/CoreStatements";
import PillarsGrid from "@/components/public/ideology/PillarsGrid";
import IdeologicalMentors from "@/components/public/ideology/IdeologicalMentors";
import RevolutionarySlogans from "@/components/public/ideology/RevolutionarySlogans";

export const metadata = {
  title: "கொள்கை | விடுதலைச் சிறுத்தைகள் கட்சி",
  description:
    "விடுதலைச் சிறுத்தைகள் கட்சியின் அடிப்படைத் தூண்கள் மற்றும் கொள்கை உறுதிப்பாடுகள்.",
};

export default function IdeologyPage() {
  return (
    <>
      <IdeologyHero />
      <CoreStatements />
      <PillarsGrid />
      <IdeologicalMentors />
      <RevolutionarySlogans />
    </>
  );
}
