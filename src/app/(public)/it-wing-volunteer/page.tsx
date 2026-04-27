import type { Metadata } from "next";
import ItWingHero from "@/components/public/it-wing/ItWingHero";
import ItWingForm from "@/components/public/it-wing/ItWingForm";

export const metadata: Metadata = {
  title: "IT Wing தன்னார்வலர் பதிவு | விடுதலைச் சிறுத்தைகள் கட்சி",
  description:
    "VCK IT Wing தன்னார்வலர் பதிவு படிவம். உங்கள் திறன்களை கட்சிக்கு பயன்படுத்துங்கள்.",
};

export default function ItWingVolunteerPage() {
  return (
    <>
      <ItWingHero />
      <ItWingForm />
    </>
  );
}
