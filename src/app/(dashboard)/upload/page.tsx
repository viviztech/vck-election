"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ImageDropzone } from "@/components/upload/ImageDropzone";
import { UploadProgressBar } from "@/components/upload/UploadProgressBar";

type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [entryId, setEntryId] = useState<string | null>(null);

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setStatus("idle");
    setProgress(0);
    setMessage("");
    setEntryId(null);
  }, []);

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);
    setMessage("Getting upload URL...");

    try {
      // Step 1: Get presigned URL or local upload key
      const presignRes = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });
      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, imageKey, useLocal } = await presignRes.json();

      setProgress(20);
      setMessage("Uploading image...");

      if (useLocal) {
        // Local mode: POST file as multipart to /api/upload/local
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 60) + 20;
              setProgress(pct);
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`Upload failed: ${xhr.status}`));
          xhr.onerror = () => reject(new Error("Upload network error"));

          const formData = new FormData();
          formData.append("file", file);
          formData.append("imageKey", imageKey);

          xhr.open("POST", "/api/upload/local");
          xhr.send(formData);
        });
      } else {
        // S3 mode: PUT directly to presigned URL
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 60) + 20;
              setProgress(pct);
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`Upload failed: ${xhr.status}`));
          xhr.onerror = () => reject(new Error("Upload network error"));
          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      }

      setProgress(90);
      setMessage("Confirming upload...");

      // Step 3: Confirm upload, create FormEntry
      const confirmRes = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageKey,
          mimeType: file.type,
          sizeBytes: file.size,
          filename: file.name,
        }),
      });
      if (!confirmRes.ok) throw new Error("Failed to confirm upload");
      const { entryId: id } = await confirmRes.json();
      setEntryId(id);

      setProgress(100);
      setStatus("done");
      setMessage("Upload complete! Redirecting...");

      setTimeout(() => {
        router.push(`/entries/${id}`);
      }, 1000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "An error occurred");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Upload VCK Form" />
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upload a VCK Application Form</h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload the scanned form — the team will manually enter the details for verification.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <ImageDropzone
            onFileSelected={handleFileSelected}
            disabled={status === "uploading" || status === "processing"}
          />

          {file && status === "idle" && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{file.type.includes("pdf") ? "📑" : "🖼️"}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            </div>
          )}

          <UploadProgressBar progress={progress} status={status} message={message} />

          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading" || status === "processing" || status === "done"}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            {status === "idle" && "Upload Form"}
            {status === "uploading" && "Uploading..."}
            {status === "done" && "Done! Redirecting..."}
            {status === "error" && "Retry"}
          </button>

          {status === "error" && (
            <button
              onClick={() => { setStatus("idle"); setProgress(0); setMessage(""); }}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset and try again
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
          <p className="font-semibold mb-2">How it works:</p>
          <ol className="space-y-1 list-decimal list-inside text-blue-700">
            <li>Upload the form image (JPEG, PNG, or PDF)</li>
            <li>Team manually enters the details from the form</li>
            <li>Review and verify the entry</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
