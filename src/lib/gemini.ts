import { GoogleGenerativeAI } from "@google/generative-ai";

// Re-use the same response shape so the trigger route stays unchanged
export interface OcrResponse {
  request_id: string;
  pages: Array<{
    page: number;
    text: string;
    width: number;
    height: number;
  }>;
}

const PROMPT = `This is a scanned VCK (Vidutalai Chiruthaigal Katchi) party membership form written in Tamil.
Extract ALL the text exactly as it appears in the image, preserving the structure line by line.
Keep Tamil text as-is. Keep field labels and values on the same line separated by colon where possible.
Do not translate. Do not summarize. Output only the raw extracted text.`;

export async function runGeminiOcr(imageUrl: string): Promise<OcrResponse> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Fetch image and convert to base64
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const base64 = imgBuffer.toString("base64");
  const mimeType = imgRes.headers.get("content-type") ?? "image/jpeg";

  const result = await model.generateContent([
    PROMPT,
    {
      inlineData: {
        mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp",
        data: base64,
      },
    },
  ]);

  const text = result.response.text();
  const requestId = `gemini-${Date.now()}`;

  return {
    request_id: requestId,
    pages: [{ page: 1, text, width: 0, height: 0 }],
  };
}

export function extractFullText(response: OcrResponse): string {
  return response.pages.map((p) => p.text).join("\n");
}
