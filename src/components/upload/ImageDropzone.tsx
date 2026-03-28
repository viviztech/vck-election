"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFileSelected, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setPreview(file.type === "application/pdf" ? null : URL.createObjectURL(file));
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  async function openCamera() {
    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError("Camera access denied. Please allow camera permission and try again.");
      setCameraOpen(false);
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError("");
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      onFileSelected(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  }

  return (
    <div className="space-y-3">
      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <span className="text-white font-semibold text-sm">படிவத்தை கேமராவில் பிடிக்கவும்</span>
            <button onClick={closeCamera} className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded-lg border border-gray-600 hover:border-gray-400">
              ✕ Close
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="px-4 py-5 bg-gray-900 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-gray-400 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center shadow-lg"
              title="Capture"
            >
              <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition" />
            </button>
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Form preview"
              className="max-h-64 mx-auto rounded-lg object-contain shadow"
            />
            <p className="text-sm text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl">📄</div>
            <div>
              <p className="text-gray-700 font-medium">
                {isDragActive ? "Drop the form here..." : "Upload VCK Form"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Drag & drop or click to select · JPEG, PNG, PDF · Max 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Camera button */}
      {!disabled && (
        <button
          type="button"
          onClick={openCamera}
          className="w-full py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2"
        >
          <span className="text-lg">📷</span>
          கேமரா மூலம் படம் எடுக்கவும் (Use Camera)
        </button>
      )}

      {cameraError && (
        <p className="text-xs text-red-600 text-center">{cameraError}</p>
      )}
    </div>
  );
}
