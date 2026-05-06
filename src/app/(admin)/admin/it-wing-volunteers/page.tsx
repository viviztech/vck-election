import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ItWingVolunteersClient } from "@/components/admin/ItWingVolunteersClient";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "IT Wing Volunteers" };

export default async function ItWingVolunteersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="IT Wing தன்னார்வலர்கள்" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex justify-end">
          <Link
            href="/admin/it-wing-volunteers/reports"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
          >
            📊 அறிக்கைகள் & பகுப்பாய்வு
          </Link>
        </div>
        <ItWingVolunteersClient />
      </div>
    </div>
  );
}
