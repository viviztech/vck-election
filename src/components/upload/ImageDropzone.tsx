"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFileSelected, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type === "application/pdf") {
        setPreview(null);
      } else {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
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

  return (
    <div>
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
    </div>
  );
}
