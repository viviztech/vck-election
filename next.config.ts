import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose env vars to SSR runtime on Amplify WEB_COMPUTE
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
    S3_REGION: process.env.S3_REGION ?? "ap-south-1",
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "vck-forms-app",
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID ?? "",
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ?? "",
    GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
