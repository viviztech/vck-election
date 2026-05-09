import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface StudentBody {
  name: string;
  fatherName?: string;
  dob?: string;
  age?: number;
  gender?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  currentClass?: string;
  department?: string;
  schoolName: string;
  rollNumber?: string;
  marks10th?: string;
  max10th?: string;
  percent10th?: string;
  marks12th?: string;
  max12th?: string;
  percent12th?: string;
  marksCurrent?: string;
  maxCurrent?: string;
  percentCurrent?: string;
  doorNo?: string;
  village?: string;
  taluk?: string;
  district: string;
  pincode?: string;
  studentWingMember?: boolean;
  studentWingName?: string;
  hearAboutUs?: string;
  remarks?: string;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = body as StudentBody;

  if (!b.name || typeof b.name !== "string" || b.name.trim() === "") {
    return NextResponse.json({ error: "பெயர் அவசியம்" }, { status: 400 });
  }
  if (!b.phone || typeof b.phone !== "string" || b.phone.trim() === "") {
    return NextResponse.json({ error: "தொலைபேசி எண் அவசியம்" }, { status: 400 });
  }
  if (!b.schoolName || typeof b.schoolName !== "string" || b.schoolName.trim() === "") {
    return NextResponse.json({ error: "பள்ளி / கல்லூரி பெயர் அவசியம்" }, { status: 400 });
  }
  if (!b.district || typeof b.district !== "string" || b.district.trim() === "") {
    return NextResponse.json({ error: "மாவட்டம் அவசியம்" }, { status: 400 });
  }

  const genderMap: Record<string, "MALE" | "FEMALE" | "OTHER"> = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
  };
  const gender = b.gender && genderMap[b.gender] ? genderMap[b.gender] : undefined;

  try {
    await prisma.studentRegistration.create({
      data: {
        name: b.name.trim(),
        fatherName: str(b.fatherName) ?? null,
        dob: str(b.dob) ?? null,
        age: typeof b.age === "number" && b.age > 0 ? b.age : null,
        gender: gender ?? null,
        phone: b.phone.trim(),
        whatsapp: str(b.whatsapp) ?? null,
        email: str(b.email) ?? null,
        currentClass: str(b.currentClass) ?? null,
        department: str(b.department) ?? null,
        schoolName: b.schoolName.trim(),
        rollNumber: str(b.rollNumber) ?? null,
        marks10th: str(b.marks10th) ?? null,
        max10th: str(b.max10th) ?? null,
        percent10th: str(b.percent10th) ?? null,
        marks12th: str(b.marks12th) ?? null,
        max12th: str(b.max12th) ?? null,
        percent12th: str(b.percent12th) ?? null,
        marksCurrent: str(b.marksCurrent) ?? null,
        maxCurrent: str(b.maxCurrent) ?? null,
        percentCurrent: str(b.percentCurrent) ?? null,
        doorNo: str(b.doorNo) ?? null,
        village: str(b.village) ?? null,
        taluk: str(b.taluk) ?? null,
        district: b.district.trim(),
        pincode: str(b.pincode) ?? null,
        studentWingMember: typeof b.studentWingMember === "boolean" ? b.studentWingMember : null,
        studentWingName: str(b.studentWingName) ?? null,
        hearAboutUs: str(b.hearAboutUs) ?? null,
        remarks: str(b.remarks) ?? null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[student-registration] db error:", error);
    return NextResponse.json(
      { error: "தரவை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." },
      { status: 500 }
    );
  }
}
