import type { Metadata } from "next";
import StudentRegistrationHero from "@/components/public/student-registration/StudentRegistrationHero";
import StudentRegistrationForm from "@/components/public/student-registration/StudentRegistrationForm";

export const metadata: Metadata = {
  title: "மாணவர் பதிவு | நீங்களும் ஒரு வெற்றியாளர் | விடுதலைச் சிறுத்தைகள் கட்சி",
  description:
    "நீங்களும் ஒரு வெற்றியாளர் — VCK மாணவர் பதிவு படிவம். இன்றே பதிவு செய்யுங்கள்.",
};

export default function StudentRegistrationPage() {
  return (
    <>
      <StudentRegistrationHero />
      <StudentRegistrationForm />
    </>
  );
}
