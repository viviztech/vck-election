import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { districtId, constituencyId, isVerified, format = "xlsx" } = body;

  const where: Record<string, unknown> = {};
  if (session.user.role === "USER") where.submittedById = session.user.id;
  if (districtId) where.districtId = districtId;
  if (constituencyId) where.constituencyId = constituencyId;
  if (isVerified !== undefined) where.isVerified = isVerified;

  const entries = await prisma.formEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      district: { select: { nameEnglish: true, nameTamil: true } },
      constituency: { select: { nameEnglish: true, nameTamil: true } },
      submittedBy: { select: { name: true, email: true } },
    },
    take: 5000,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("VCK Form Entries");

  sheet.columns = [
    { header: "Serial No", key: "serialNumber", width: 12 },
    { header: "Name (பெயர்)", key: "name", width: 30 },
    { header: "Parent Name (த.பெ/க.பெ)", key: "parentName", width: 30 },
    { header: "Parent Type", key: "parentType", width: 12 },
    { header: "Address (முகவரி)", key: "address", width: 40 },
    { header: "Contact (தொடர்பு எண்)", key: "contactNumber", width: 15 },
    { header: "District (மாவட்டம்)", key: "district", width: 20 },
    { header: "Constituency (தொகுதி)", key: "constituency", width: 20 },
    { header: "Year Joined (சேர்ந்த ஆண்டு)", key: "yearJoinedParty", width: 15 },
    { header: "Party Position (பொறுப்பு நிலை)", key: "partyPosition", width: 25 },
    { header: "Receipt No (ரசீது எண்)", key: "feeReceiptNumber", width: 20 },
    { header: "Entry Date (நாள்)", key: "entryDate", width: 15 },
    { header: "Place (இடம்)", key: "entryPlace", width: 20 },
    { header: "Verified", key: "isVerified", width: 10 },
    { header: "OCR Status", key: "ocrStatus", width: 12 },
    { header: "Submitted By", key: "submittedBy", width: 25 },
    { header: "Created At", key: "createdAt", width: 20 },
  ];

  // Style header row
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E3A5F" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  for (const entry of entries) {
    sheet.addRow({
      serialNumber: entry.serialNumber ?? "",
      name: entry.name ?? "",
      parentName: entry.parentName ?? "",
      parentType: entry.parentType ?? "",
      address: entry.address ?? "",
      contactNumber: entry.contactNumber ?? "",
      district: entry.district?.nameTamil
        ? `${entry.district.nameTamil} (${entry.district.nameEnglish})`
        : entry.rawDistrictText ?? "",
      constituency: entry.constituency?.nameTamil
        ? `${entry.constituency.nameTamil} (${entry.constituency.nameEnglish})`
        : entry.rawConstituencyText ?? "",
      yearJoinedParty: entry.yearJoinedParty ?? "",
      partyPosition: entry.partyPosition ?? "",
      feeReceiptNumber: entry.feeReceiptNumber ?? "",
      entryDate: entry.entryDate ? new Date(entry.entryDate).toLocaleDateString("en-IN") : "",
      entryPlace: entry.entryPlace ?? "",
      isVerified: entry.isVerified ? "Yes" : "No",
      ocrStatus: entry.ocrStatus,
      submittedBy: entry.submittedBy?.name ?? entry.submittedBy?.email ?? "",
      createdAt: new Date(entry.createdAt).toLocaleString("en-IN"),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="vck-entries-${Date.now()}.xlsx"`,
    },
  });
}
