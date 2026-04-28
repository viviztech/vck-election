import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface VolunteerBody {
  name: string;
  age?: number;
  dob?: string;
  gender?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  voterId?: string;
  town?: string;
  pincode?: string;
  address?: string;
  education: string;
  occupation?: string;
  district: string;
  constituency: string;
  itKnowledge: boolean;
  videoCreation: boolean;
  imageCreation: boolean;
  itSkills?: string[];
  softwareTools?: string;
  yearsExp?: number;
  primaryDevice?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  twitterX?: string;
  followers?: string;
  availability?: string;
  languages?: string[];
  canTravel?: boolean;
  vckMember?: boolean;
  priorExperience?: string;
  hearAboutUs?: string;
  joinReason: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function strArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim() !== "") : [];
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = body as VolunteerBody;

  if (!b.name || typeof b.name !== "string" || b.name.trim() === "") {
    return NextResponse.json({ error: "பெயர் அவசியம்" }, { status: 400 });
  }
  if (!b.phone || typeof b.phone !== "string" || b.phone.trim() === "") {
    return NextResponse.json({ error: "தொலைபேசி எண் அவசியம்" }, { status: 400 });
  }
  if (!b.education || typeof b.education !== "string" || b.education.trim() === "") {
    return NextResponse.json({ error: "கல்வித்தகுதி அவசியம்" }, { status: 400 });
  }
  if (!b.district || typeof b.district !== "string" || b.district.trim() === "") {
    return NextResponse.json({ error: "மாவட்டம் அவசியம்" }, { status: 400 });
  }
  if (!b.constituency || typeof b.constituency !== "string" || b.constituency.trim() === "") {
    return NextResponse.json({ error: "சட்டமன்றத் தொகுதி அவசியம்" }, { status: 400 });
  }
  if (!b.joinReason || typeof b.joinReason !== "string" || b.joinReason.trim() === "") {
    return NextResponse.json({ error: "இணைய காரணம் அவசியம்" }, { status: 400 });
  }

  const genderMap: Record<string, "MALE" | "FEMALE" | "OTHER"> = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
  };
  const gender = b.gender && genderMap[b.gender] ? genderMap[b.gender] : undefined;

  try {
    await prisma.itWingVolunteer.create({
      data: {
        name: b.name.trim(),
        age: typeof b.age === "number" && b.age > 0 ? b.age : null,
        dob: str(b.dob) ?? null,
        gender: gender ?? null,
        phone: b.phone.trim(),
        whatsapp: str(b.whatsapp) ?? null,
        email: str(b.email) ?? null,
        voterId: str(b.voterId) ?? null,
        town: str(b.town) ?? null,
        pincode: str(b.pincode) ?? null,
        address: str(b.address) ?? null,
        education: b.education.trim(),
        occupation: str(b.occupation) ?? null,
        district: b.district.trim(),
        constituency: b.constituency.trim(),
        itKnowledge: Boolean(b.itKnowledge),
        videoCreation: Boolean(b.videoCreation),
        imageCreation: Boolean(b.imageCreation),
        itSkills: strArr(b.itSkills),
        softwareTools: str(b.softwareTools) ?? null,
        yearsExp: typeof b.yearsExp === "number" && b.yearsExp >= 0 ? b.yearsExp : null,
        primaryDevice: str(b.primaryDevice) ?? null,
        facebook: str(b.facebook) ?? null,
        youtube: str(b.youtube) ?? null,
        instagram: str(b.instagram) ?? null,
        twitterX: str(b.twitterX) ?? null,
        followers: str(b.followers) ?? null,
        availability: str(b.availability) ?? null,
        languages: strArr(b.languages),
        canTravel: typeof b.canTravel === "boolean" ? b.canTravel : null,
        vckMember: typeof b.vckMember === "boolean" ? b.vckMember : null,
        priorExperience: str(b.priorExperience) ?? null,
        hearAboutUs: str(b.hearAboutUs) ?? null,
        joinReason: b.joinReason.trim(),
        emergencyName: str(b.emergencyName) ?? null,
        emergencyPhone: str(b.emergencyPhone) ?? null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[it-wing-volunteer] db error:", error);
    return NextResponse.json(
      { error: "தரவை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்." },
      { status: 500 }
    );
  }
}
