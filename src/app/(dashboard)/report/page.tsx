import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReportClient } from "@/components/shared/ReportClient";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ constituencyId?: string; districtId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const sp = await searchParams;

  const [districts, constituencies] = await Promise.all([
    prisma.district.findMany({ orderBy: { nameEnglish: "asc" } }),
    prisma.constituency.findMany({ orderBy: { nameEnglish: "asc" }, include: { district: { select: { nameTamil: true, nameEnglish: true } } } }),
  ]);

  const where: Record<string, unknown> = {};
  if (sp.constituencyId) where.constituencyId = sp.constituencyId;
  else if (sp.districtId) where.districtId = sp.districtId;

  const entries = sp.constituencyId || sp.districtId
    ? await prisma.formEntry.findMany({
        where,
        orderBy: { serialNumber: "asc" },
        select: {
          id: true,
          serialNumber: true,
          name: true,
          parentName: true,
          partyPosition: true,
          contactNumber: true,
          forThalaivar: true,
          paymentMode: true,
          constituency: { select: { nameTamil: true, nameEnglish: true } },
          district: { select: { nameTamil: true, nameEnglish: true } },
        },
      })
    : [];

  return (
    <ReportClient
      entries={entries}
      districts={districts}
      constituencies={constituencies}
      selectedConstituencyId={sp.constituencyId ?? ""}
      selectedDistrictId={sp.districtId ?? ""}
    />
  );
}
