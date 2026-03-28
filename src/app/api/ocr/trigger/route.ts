import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runSarvamOcr, runSarvamOcrFromLocalFile, extractFullText } from "@/lib/sarvam";
import { parseOcrTextToFields } from "@/lib/ocr-parser";
import { matchDistrict, matchConstituency } from "@/lib/fuzzy-match";

function hasAwsCredentials() {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { entryId } = await req.json();
    if (!entryId) return NextResponse.json({ error: "entryId required" }, { status: 400 });

    const entry = await prisma.formEntry.findUnique({ where: { id: entryId } });
    if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    if (entry.submittedById !== session.user.id && session.user.role === "USER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.formEntry.update({
      where: { id: entryId },
      data: { ocrStatus: "PROCESSING" },
    });

    let ocrResponse;
    try {
      if (hasAwsCredentials()) {
        // S3 mode: generate presigned read URL for Sarvam
        const { getPresignedReadUrl } = await import("@/lib/s3");
        const imageUrl = await getPresignedReadUrl(entry.imageKey);
        ocrResponse = await runSarvamOcr(imageUrl);
      } else {
        // Local mode: read file from disk, zip it, and send to Sarvam
        ocrResponse = await runSarvamOcrFromLocalFile(entry.imageKey, entry.imageMimeType ?? "image/jpeg");
      }
    } catch (err) {
      await prisma.formEntry.update({
        where: { id: entryId },
        data: {
          ocrStatus: "FAILED",
          ocrErrorMessage: String(err),
        },
      });
      return NextResponse.json({ error: "OCR failed", details: String(err) }, { status: 502 });
    }

    const rawText = extractFullText(ocrResponse);
    const parsed = parseOcrTextToFields(rawText);

    // Fuzzy match district and constituency
    const districts = await prisma.district.findMany();
    const matchedDistrict = parsed.rawDistrictText
      ? matchDistrict(parsed.rawDistrictText, districts)
      : null;

    const constituencies = matchedDistrict
      ? await prisma.constituency.findMany({ where: { districtId: matchedDistrict.id } })
      : await prisma.constituency.findMany();

    const matchedConstituency = parsed.rawConstituencyText
      ? matchConstituency(parsed.rawConstituencyText, constituencies)
      : null;

    // Parse entry date
    let entryDate: Date | undefined;
    if (parsed.entryDate) {
      const dateStr = parsed.entryDate.replace(/[\-\.]/g, "-");
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) entryDate = d;
    }

    await prisma.formEntry.update({
      where: { id: entryId },
      data: {
        ocrStatus: "COMPLETED",
        ocrRawResponse: ocrResponse as object,
        ocrProcessedAt: new Date(),
        ocrJobId: ocrResponse.request_id,
        serialNumber: parsed.serialNumber,
        rawDistrictText: parsed.rawDistrictText,
        rawConstituencyText: parsed.rawConstituencyText,
        districtId: matchedDistrict?.id,
        constituencyId: matchedConstituency?.id,
        name: parsed.name,
        parentName: parsed.parentName,
        parentType: parsed.parentType,
        address: parsed.address,
        contactNumber: parsed.contactNumber,
        yearJoinedParty: parsed.yearJoinedParty,
        partyPosition: parsed.partyPosition,
        feeReceiptNumber: parsed.feeReceiptNumber,
        entryDate: entryDate,
        entryPlace: parsed.entryPlace,
      },
    });

    await prisma.auditLog.create({
      data: {
        entryId,
        userId: session.user.id,
        action: "OCR_COMPLETED",
        changes: { rawText: rawText.slice(0, 500) },
      },
    });

    return NextResponse.json({ status: "COMPLETED", jobId: ocrResponse.request_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
