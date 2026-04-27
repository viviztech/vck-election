import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ItWingVolunteersClient } from "@/components/admin/ItWingVolunteersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "IT Wing Volunteers" };

export default async function ItWingVolunteersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="IT Wing தன்னார்வலர்கள்" />
      <div className="flex-1 p-6">
        <ItWingVolunteersClient />
      </div>
    </div>
  );
}
