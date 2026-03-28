import { readFile } from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";

const SARVAM_BASE_URL = "https://api.sarvam.ai";

export interface SarvamOcrResponse {
  request_id: string;
  pages: Array<{
    page: number;
    text: string;
    width: number;
    height: number;
  }>;
}

/** Full doc-digitization workflow: create job → upload ZIP → start → poll → download → parse markdown */
export async function runSarvamOcrFromLocalFile(
  imageKey: string,
  mimeType: string
): Promise<SarvamOcrResponse> {
  const apiKey = process.env.SARVAM_API_KEY ?? "";
  const filePath = path.join(process.cwd(), "public", "uploads", imageKey);

  // 1. Read the image file
  const imageBuffer = await readFile(filePath);
  const filename = path.basename(imageKey);

  // 2. Create a ZIP containing the image
  const zip = new AdmZip();
  zip.addFile(filename, imageBuffer);
  const zipBuffer = zip.toBuffer();

  // 3. Create a Sarvam job
  const createRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_parameters: { language: "ta-IN", output_format: "md" },
    }),
  });
  if (!createRes.ok) {
    throw new Error(`Sarvam create job failed: ${createRes.status} ${await createRes.text()}`);
  }
  const { job_id } = await createRes.json();

  // 4. Get presigned upload URL
  const uploadUrlRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/upload-files`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ job_id, files: ["document.zip"] }),
  });
  if (!uploadUrlRes.ok) {
    throw new Error(`Sarvam upload-files failed: ${uploadUrlRes.status} ${await uploadUrlRes.text()}`);
  }
  const uploadData = await uploadUrlRes.json();
  const presignedUrl: string = uploadData.upload_urls["document.zip"].file_url;

  // 5. Upload ZIP to Azure presigned URL
  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": "application/zip",
    },
    body: zipBuffer,
  });
  if (!putRes.ok) {
    throw new Error(`Sarvam ZIP upload failed: ${putRes.status}`);
  }

  // 6. Start the job
  const startRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/start`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (!startRes.ok) {
    throw new Error(`Sarvam start job failed: ${startRes.status} ${await startRes.text()}`);
  }

  // 7. Poll for completion (max 120s)
  let jobState = "Pending";
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/status`, {
      headers: { "api-subscription-key": apiKey },
    });
    if (!statusRes.ok) continue;
    const statusData = await statusRes.json();
    jobState = statusData.job_state;
    if (jobState === "Completed" || jobState === "PartiallyCompleted" || jobState === "Failed") break;
  }

  if (jobState === "Failed") {
    throw new Error("Sarvam OCR job failed");
  }
  if (jobState !== "Completed" && jobState !== "PartiallyCompleted") {
    throw new Error("Sarvam OCR job timed out");
  }

  // 8. Get download URL
  const downloadRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/download-files`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (!downloadRes.ok) {
    throw new Error(`Sarvam download-files failed: ${downloadRes.status} ${await downloadRes.text()}`);
  }
  const downloadData = await downloadRes.json();
  const downloadUrl: string = Object.values(downloadData.download_urls as Record<string, { file_url: string }>)[0].file_url;

  // 9. Download the result ZIP and extract markdown
  const resultRes = await fetch(downloadUrl);
  if (!resultRes.ok) {
    throw new Error(`Sarvam result download failed: ${resultRes.status}`);
  }
  const resultBuffer = Buffer.from(await resultRes.arrayBuffer());
  const resultZip = new AdmZip(resultBuffer);
  const mdEntry = resultZip.getEntries().find((e) => e.entryName.endsWith(".md"));
  const markdownText = mdEntry ? mdEntry.getData().toString("utf-8") : "";

  // 10. Strip embedded base64 images from markdown (keep only text)
  const cleanedText = markdownText
    .replace(/!\[.*?\]\(data:image\/[^)]+\)/g, "")
    .trim();

  // Return in the same shape as the old API response
  return {
    request_id: job_id,
    pages: [{ page: 1, text: cleanedText, width: 0, height: 0 }],
  };
}

/** S3-based OCR: pass a publicly accessible URL */
export async function runSarvamOcr(imageUrl: string): Promise<SarvamOcrResponse> {
  const apiKey = process.env.SARVAM_API_KEY ?? "";

  // Create job
  const createRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ job_parameters: { language: "ta-IN", output_format: "md" } }),
  });
  if (!createRes.ok) throw new Error(`Sarvam create job failed: ${createRes.status}`);
  const { job_id } = await createRes.json();

  // For S3 URLs, download the file and treat it as a local upload
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to fetch image from S3: ${imgRes.status}`);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // Determine extension from URL
  const ext = imageUrl.split("?")[0].split(".").pop() ?? "jpg";
  const fname = `document.${ext}`;

  const zip = new AdmZip();
  zip.addFile(fname, imgBuffer);
  const zipBuffer = zip.toBuffer();

  // Get upload URL
  const uploadUrlRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/upload-files`, {
    method: "POST",
    headers: { "api-subscription-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ job_id, files: ["document.zip"] }),
  });
  if (!uploadUrlRes.ok) throw new Error(`Sarvam upload-files failed: ${uploadUrlRes.status}`);
  const uploadData = await uploadUrlRes.json();
  const presignedUrl: string = uploadData.upload_urls["document.zip"].file_url;

  await fetch(presignedUrl, {
    method: "PUT",
    headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/zip" },
    body: zipBuffer,
  });

  await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/start`, {
    method: "POST",
    headers: { "api-subscription-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  let jobState = "Pending";
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/status`, {
      headers: { "api-subscription-key": apiKey },
    });
    if (statusRes.ok) {
      const s = await statusRes.json();
      jobState = s.job_state;
      if (["Completed", "PartiallyCompleted", "Failed"].includes(jobState)) break;
    }
  }

  if (jobState === "Failed") throw new Error("Sarvam OCR job failed");

  const downloadRes = await fetch(`${SARVAM_BASE_URL}/doc-digitization/job/v1/${job_id}/download-files`, {
    method: "POST",
    headers: { "api-subscription-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!downloadRes.ok) throw new Error(`Sarvam download-files failed`);
  const downloadData = await downloadRes.json();
  const downloadUrl: string = Object.values(downloadData.download_urls as Record<string, { file_url: string }>)[0].file_url;

  const resultRes = await fetch(downloadUrl);
  const resultBuffer = Buffer.from(await resultRes.arrayBuffer());
  const resultZip = new AdmZip(resultBuffer);
  const mdEntry = resultZip.getEntries().find((e) => e.entryName.endsWith(".md"));
  const markdownText = mdEntry ? mdEntry.getData().toString("utf-8") : "";
  const cleanedText = markdownText.replace(/!\[.*?\]\(data:image\/[^)]+\)/g, "").trim();

  return {
    request_id: job_id,
    pages: [{ page: 1, text: cleanedText, width: 0, height: 0 }],
  };
}

export function extractFullText(response: SarvamOcrResponse): string {
  return response.pages.map((p) => p.text).join("\n");
}
