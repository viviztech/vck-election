import { z } from "zod";

export const PresignedUrlSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
  sizeBytes: z.number().int().min(1).max(10 * 1024 * 1024), // 10 MB max
});

export const ConfirmUploadSchema = z.object({
  imageKey: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().optional(),
  filename: z.string().optional(),
});

export type PresignedUrlInput = z.infer<typeof PresignedUrlSchema>;
export type ConfirmUploadInput = z.infer<typeof ConfirmUploadSchema>;
