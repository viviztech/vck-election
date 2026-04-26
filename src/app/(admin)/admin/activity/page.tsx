import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ActivityLogClient } from "@/components/admin/ActivityLogClient"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Activity Log" }

export default async function ActivityPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === "USER") redirect("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Activity Log" />
      <div className="flex-1 p-6">
        <ActivityLogClient currentRole={session.user.role} />
      </div>
    </div>
  )
}
