import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostingsClient } from "@/components/admin/PostingsClient";

export const dynamic = "force-dynamic";

export default async function PostingsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN";
  if (!isAdmin) return notFound();

  const postingTypes = await prisma.postingType.findMany({
    orderBy: [{ bodyType: "asc" }, { order: "asc" }],
    include: { _count: { select: { members: true } } },
  });

  return <PostingsClient initialPostingTypes={postingTypes} />;
}
