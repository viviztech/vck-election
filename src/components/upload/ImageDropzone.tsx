"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFileSelected, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [cropRect, setCropRect] = useState({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [cameraStep, setCameraStep] = useState<"video" | "crop">("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setPreview(file.type === "application/pdf" ? null : URL.createObjectURL(file));
      onFileSelected(file);
    },
    [onFileSelected]
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    };
  }, [preview, capturedUrl]);

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
    setCameraStep("video");
    setCapturedUrl(null);
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

  function stopVideoStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function closeCamera() {
    stopVideoStream();
    setCameraOpen(false);
    setCameraError("");
    setCameraStep("video");
    setCapturedUrl(null);
    setCropRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    setIsDraggingCrop(false);
    setDragStart(null);
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
      const url = URL.createObjectURL(blob);
      setCapturedUrl(url);
      setCameraStep("crop");
      stopVideoStream();
      setCropRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    }, "image/jpeg", 0.92);
  }

  function clampCrop(rect: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(rect.x, 1 - rect.width));
    const y = Math.max(0, Math.min(rect.y, 1 - rect.height));
    const width = Math.max(0.1, Math.min(rect.width, 1 - x));
    const height = Math.max(0.1, Math.min(rect.height, 1 - y));
    return { x, y, width, height };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!cropImageRef.current || !capturedUrl) return;

    const bounds = cropImageRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setIsDraggingCrop(true);
    setDragStart({ x, y });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingCrop || !dragStart || !cropImageRef.current) return;

    const bounds = cropImageRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    setCropRect((current) => clampCrop({
      x: current.x + dx,
      y: current.y + dy,
      width: current.width,
      height: current.height,
    }));
    setDragStart({ x, y });
  }

  function handlePointerUp() {
    setIsDraggingCrop(false);
    setDragStart(null);
  }

  async function cropBlobFromImage(url: string, rect: { x: number; y: number; width: number; height: number }) {
    return new Promise<Blob | null>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * rect.width);
        canvas.height = Math.round(image.naturalHeight * rect.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        const sx = Math.round(image.naturalWidth * rect.x);
        const sy = Math.round(image.naturalHeight * rect.y);
        const sw = Math.round(image.naturalWidth * rect.width);
        const sh = Math.round(image.naturalHeight * rect.height);
        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
      };
      image.onerror = () => resolve(null);
      image.src = url;
    });
  }

  async function confirmCrop() {
    if (!capturedUrl) return;
    const blob = await cropBlobFromImage(capturedUrl, cropRect);
    if (!blob) return;
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    setPreview(url);
    onFileSelected(file);
    closeCamera();
  }

  async function useFullImage() {
    if (!capturedUrl) return;
    const response = await fetch(capturedUrl);
    const blob = await response.blob();
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: blob.type || "image/jpeg" });
    setPreview(capturedUrl);
    onFileSelected(file);
    closeCamera();
  }

  return (
    <div className="space-y-3">
      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <span className="text-white font-semibold text-sm">
              {cameraStep === "video" ? "படிவத்தை கேமராவில் பிடிக்கவும்" : "கடவுச்சொல்லை திருத்தவும் (Crop)"}
            </span>
            <button
              onClick={closeCamera}
              className="text-gray-300 hover:text-white text-sm px-3 py-1 rounded-lg border border-gray-600 hover:border-gray-400"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-black overflow-hidden px-4 py-4">
            {cameraStep === "video" && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-w-full max-h-full object-contain"
              />
            )}

            {cameraStep === "crop" && capturedUrl && (
              <div className="relative max-w-full max-h-full">
                <img
                  ref={cropImageRef}
                  src={capturedUrl}
                  alt="Captured preview"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
                <div
                  className="absolute inset-0 cursor-move"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  <div
                    className="absolute border-2 border-white/90 bg-white/10 backdrop-blur-sm"
                    style={{
                      left: `${cropRect.x * 100}%`,
                      top: `${cropRect.y * 100}%`,
                      width: `${cropRect.width * 100}%`,
                      height: `${cropRect.height * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-5 bg-gray-900 flex flex-col gap-3">
            {cameraStep === "video" && (
              <button
                onClick={capturePhoto}
                className="self-center w-16 h-16 rounded-full bg-white border-4 border-gray-400 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center shadow-lg"
                title="Capture"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition" />
              </button>
            )}

            {cameraStep === "crop" && (
              <div className="flex flex-col gap-3">
                <p className="text-center text-sm text-gray-300">
                  Drag the selection box to choose the required form area.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={confirmCrop}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition"
                  >
                    Crop and use selection
                  </button>
                  <button
                    type="button"
                    onClick={useFullImage}
                    className="px-4 py-2 rounded-xl bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition"
                  >
                    Use full image
                  </button>
                  <button
                    type="button"
                    onClick={() => setCropRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 })}
                    className="px-4 py-2 rounded-xl border border-gray-500 text-gray-200 text-sm hover:border-white transition"
                  >
                    Reset crop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCameraStep("video");
                      setCapturedUrl(null);
                      setTimeout(openCamera, 0);
                    }}
                    className="px-4 py-2 rounded-xl border border-red-500 text-red-200 text-sm hover:border-red-300 transition"
                  >
                    Retake photo
                  </button>
                </div>
              </div>
            )}
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
