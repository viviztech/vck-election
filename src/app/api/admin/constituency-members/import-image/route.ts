import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

const EXTRACT_PROMPT = `This image is a VCK (Vidutalai Chiruthaigal Katchi) party district administrative list written in Tamil.

Extract the following as valid JSON only — no markdown, no explanation, just raw JSON:

{
  "constituencyName": "<constituency/district name in Tamil if found, else empty string>",
  "members": [
    {
      "postingNameTamil": "<exact Tamil role/title from the left column>",
      "name": "<person's name from the right column>"
    }
  ]
}

Rules:
- Each row in the table becomes one member entry.
- If a role has multiple people listed (like துணைச் செயலாளர்கள்), create one entry per person with the same postingNameTamil.
- Preserve Tamil text exactly as printed.
- Do not translate anything.
- Output ONLY the JSON object, nothing else.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp";
  if (!allowedTypes.includes(mimeType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are supported" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY ?? "";
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  // Convert file to base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  // Call Groq (OpenAI-compatible API)
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACT_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      temperature: 0,
    }),
  });

  if (!groqRes.ok) {
    const errText = await groqRes.text();
    return NextResponse.json({ error: `Groq API error ${groqRes.status}: ${errText}` }, { status: 502 });
  }

  const groqData = await groqRes.json();
  const raw: string = groqData.choices?.[0]?.message?.content?.trim() ?? "";

  // Strip markdown code fences if model wraps in ```json ... ```
  const jsonText = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  let parsed: { constituencyName?: string; members: { postingNameTamil: string; name: string }[] };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return NextResponse.json({ error: "Failed to parse model response", raw }, { status: 422 });
  }

  // Load all posting types and constituencies from DB for matching
  const [postingTypes, constituencies] = await Promise.all([
    prisma.postingType.findMany({ where: { isActive: true } }),
    prisma.constituency.findMany({ include: { district: true } }),
  ]);

  // Fuzzy-match posting type: find closest nameTamil
  function matchPosting(name: string) {
    const exact = postingTypes.find((p) => p.nameTamil === name);
    if (exact) return exact;
    // Partial match fallback
    const partial = postingTypes.find(
      (p) => p.nameTamil.includes(name.slice(0, 6)) || name.includes(p.nameTamil.slice(0, 6))
    );
    return partial ?? null;
  }

  // Enrich each extracted member with matched DB ids
  const enriched = parsed.members.map((m, idx) => {
    const posting = matchPosting(m.postingNameTamil);
    return {
      idx,
      name: m.name,
      postingNameTamil: m.postingNameTamil,
      postingTypeId: posting?.id ?? null,
      postingTypeNameTamil: posting?.nameTamil ?? null,
      postingTypeNameEnglish: posting?.nameEnglish ?? null,
      constituencyId: null as string | null,
      order: idx,
    };
  });

  return NextResponse.json({
    constituencyName: parsed.constituencyName ?? "",
    members: enriched,
    postingTypes: postingTypes.map((p) => ({ id: p.id, nameTamil: p.nameTamil, nameEnglish: p.nameEnglish })),
    constituencies: constituencies.map((c) => ({
      id: c.id,
      nameTamil: c.nameTamil,
      nameEnglish: c.nameEnglish,
      districtNameEnglish: c.district.nameEnglish,
      districtNameTamil: c.district.nameTamil,
    })),
  });
}
