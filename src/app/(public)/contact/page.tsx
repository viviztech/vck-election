import type { Metadata } from "next";
import ContactHero from "@/components/public/contact/ContactHero";
import ContactForm from "@/components/public/contact/ContactForm";
import ContactInfo from "@/components/public/contact/ContactInfo";

export const metadata: Metadata = {
  title: "தொடர்பு | விசி",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactInfo />
    </>
  );
}
