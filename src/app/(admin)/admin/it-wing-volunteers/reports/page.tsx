import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ItWingReportsClient } from "@/components/admin/ItWingReportsClient";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "IT Wing Volunteers — அறிக்கைகள்" };

export default async function ItWingReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="IT Wing — அறிக்கைகள் & பகுப்பாய்வு" />
      <div className="flex-1 p-6 space-y-5">
        {/* Breadcrumb / sub-nav */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/it-wing-volunteers"
            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            ← தன்னார்வலர் பட்டியல்
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-slate-800">அறிக்கைகள் & பகுப்பாய்வு</span>
        </div>

        <ItWingReportsClient />
      </div>
    </div>
  );
}
