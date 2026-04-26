import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { UserDetailClient } from "@/components/admin/UserDetailClient"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "User Detail" }

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === "USER") redirect("/dashboard")

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      suspendedAt: true,
    },
  })

  if (!user) notFound()

  const serialized = {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    suspendedAt: user.suspendedAt?.toISOString() ?? null,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={`User: ${user.name ?? user.email}`} />
      <div className="flex-1 p-6 max-w-4xl">
        <div className="mb-4">
          <a href="/admin/users" className="text-sm text-blue-600 hover:underline">
            ← Back to Users
          </a>
        </div>
        <UserDetailClient
          user={serialized}
          currentRole={session.user.role}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  )
}
