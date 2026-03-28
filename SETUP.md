# VCK Form Capture — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 bucket (Mumbai region recommended)
- Sarvam AI API key (sign up at https://sarvam.ai)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 3. Set up database
```bash
# Create the PostgreSQL database
createdb vck_form_capture

# Run migrations
npm run db:migrate

# Seed reference data (districts, constituencies) + create admin user
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
```

Visit http://localhost:3000

### Default Admin Credentials
- **Email**: admin@vck.org
- **Password**: Admin@12345
- **Role**: SUPER_ADMIN

**Change the password immediately after first login.**

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | JWT signing secret (run `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |
| `AWS_REGION` | S3 region (`ap-south-1` for Mumbai) |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_S3_BUCKET_NAME` | S3 bucket name |
| `SARVAM_API_KEY` | Sarvam AI API subscription key |

---

## AWS S3 Setup

1. Create an S3 bucket in `ap-south-1`
2. Enable CORS on the bucket:
```json
[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST"],
  "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "ExposeHeaders": ["ETag"]
}]
```
3. Create an IAM user with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` permissions on the bucket.

---

## Deployment (Vercel + Supabase)

1. Create a Supabase PostgreSQL project
2. Deploy to Vercel, set all environment variables
3. Run `npm run db:migrate` from Vercel CLI or Supabase dashboard
4. Run `npm run db:seed` to populate reference data

---

## How to Use

1. **Register** a new account at `/register`
2. **Upload** a VCK form image at `/upload`
3. **OCR** runs automatically via Sarvam AI
4. **Verify** the extracted data at the entry detail page
5. **Export** verified entries as Excel from `/export`

---

## User Roles

| Role | Access |
|---|---|
| `USER` | Upload forms, view & verify own entries, export own data |
| `ADMIN` | All USER access + view all entries, access admin stats |
| `SUPER_ADMIN` | All ADMIN access + manage user roles |
