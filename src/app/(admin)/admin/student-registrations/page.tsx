import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { StudentRegistrationsClient } from "@/components/admin/StudentRegistrationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Student Registrations" };

export default async function StudentRegistrationsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="மாணவர் பதிவுகள்" />
      <div className="flex-1 p-6 space-y-4">
        <StudentRegistrationsClient />
      </div>
    </div>
  );
}
