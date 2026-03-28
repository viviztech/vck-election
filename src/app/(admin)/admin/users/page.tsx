import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const limit = 20;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { formEntries: true } },
      },
    }),
  ]);

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  const canChangeRoles = session.user.role === "SUPER_ADMIN";

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="User Management" />
      <div className="flex-1 p-6">
        <AdminUsersClient
          users={serializedUsers}
          total={total}
          page={page}
          limit={limit}
          canChangeRoles={canChangeRoles}
        />
      </div>
    </div>
  );
}
