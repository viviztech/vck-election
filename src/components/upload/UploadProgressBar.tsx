"use client";

interface Props {
  progress: number;
  status: "idle" | "uploading" | "processing" | "done" | "error";
  message?: string;
}

export function UploadProgressBar({ progress, status, message }: Props) {
  if (status === "idle") return null;

  const statusColors = {
    uploading: "bg-blue-600",
    processing: "bg-yellow-500",
    done: "bg-green-600",
    error: "bg-red-500",
    idle: "bg-gray-300",
  };

  const statusLabels = {
    uploading: "Uploading image...",
    processing: "Running Tamil OCR (Sarvam AI)...",
    done: "OCR complete!",
    error: "Error occurred",
    idle: "",
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${status === "error" ? "text-red-600" : "text-gray-700"}`}>
          {message ?? statusLabels[status]}
        </span>
        {status !== "error" && <span className="text-gray-500">{progress}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${statusColors[status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
