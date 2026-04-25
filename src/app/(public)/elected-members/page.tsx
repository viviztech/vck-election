import type { Metadata } from "next";
import ElectedHero from "@/components/public/elected-members/ElectedHero";
import ElectedMembers from "@/components/public/elected-members/ElectedMembers";

export const metadata: Metadata = {
  title: "தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள் | விசி",
};

export default function ElectedMembersPage() {
  return (
    <>
      <ElectedHero />
      <ElectedMembers />
    </>
  );
}
