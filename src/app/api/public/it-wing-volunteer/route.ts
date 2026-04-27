import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface VolunteerBody {
  name?: string;
  age?: number;
  phone: string;
  education: string;
  district: string;
  constituency: string;
  itKnowledge: boolean;
  videoCreation: boolean;
  imageCreation: boolean;
  joinReason: string;
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    name,
    age,
    phone,
    education,
    district,
    constituency,
    itKnowledge,
    videoCreation,
    imageCreation,
    joinReason,
  } = body as VolunteerBody;

  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    return NextResponse.json({ error: "தொலைபேசி எண் அவசியம்" }, { status: 400 });
  }

  if (!education || typeof education !== "string" || education.trim() === "") {
    return NextResponse.json({ error: "கல்வித்தகுதி அவசியம்" }, { status: 400 });
  }

  if (!district || typeof district !== "string" || district.trim() === "") {
    return NextResponse.json({ error: "மாவட்டம் அவசியம்" }, { status: 400 });
  }

  if (!constituency || typeof constituency !== "string" || constituency.trim() === "") {
    return NextResponse.json({ error: "சட்டமன்றத் தொகுதி அவசியம்" }, { status: 400 });
  }

  if (!joinReason || typeof joinReason !== "string" || joinReason.trim() === "") {
    return NextResponse.json({ error: "இணைய காரணம் அவசியம்" }, { status: 400 });
  }

  try {
    await prisma.itWingVolunteer.create({
      data: {
        name: typeof name === "string" && name.trim() !== "" ? name.trim() : null,
        age: typeof age === "number" && age > 0 ? age : null,
        phone: phone.trim(),
        education: education.trim(),
        district: district.trim(),
        constituency: constituency.trim(),
        itKnowledge: Boolean(itKnowledge),
        videoCreation: Boolean(videoCreation),
        imageCreation: Boolean(imageCreation),
        joinReason: joinReason.trim(),
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
