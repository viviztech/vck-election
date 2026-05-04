import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { CommentsAdmin } from "./CommentsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Election Comments | Admin" };

export default async function ElectionCommentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") redirect("/dashboard");

  const comments = await prisma.electionComment.findMany({
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    take: 200,
    include: {
      electionResult: {
        select: { constituency: { select: { nameEnglish: true } } },
      },
    },
  });

  const serialized = comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Election Comments — Moderation" />
      <div className="flex-1 p-6">
        <CommentsAdmin comments={serialized} />
      </div>
    </div>
  );
}
