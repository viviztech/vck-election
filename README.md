# விடுதலைச் சிறுத்தைகள் கட்சி — Member Form Capture System

Tamil OCR-powered membership form data capture and verification system built with Next.js 16, Prisma, and Sarvam AI.

---

## Table of Contents

- [Local Development](#local-development)
- [AWS Deployment](#aws-deployment)
  - [Architecture Overview](#architecture-overview)
  - [1. RDS PostgreSQL](#1-rds-postgresql)
  - [2. S3 Bucket](#2-s3-bucket)
  - [3. IAM User & Permissions](#3-iam-user--permissions)
  - [4. EC2 Setup](#4-ec2-setup)
  - [5. Environment Variables](#5-environment-variables)
  - [6. Deploy Application](#6-deploy-application)
  - [7. Nginx Reverse Proxy](#7-nginx-reverse-proxy)
  - [8. SSL with Certbot](#8-ssl-with-certbot)
  - [9. Run as Systemd Service](#9-run-as-systemd-service)
- [User Roles](#user-roles)
- [How to Use](#how-to-use)

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Sarvam AI API key — sign up at https://sarvam.ai

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create database
createdb vck_form_capture

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local — at minimum set DATABASE_URL, NEXTAUTH_SECRET, SARVAM_API_KEY

# 4. Run migrations and seed reference data
npm run db:migrate
npm run db:seed

# 5. Start dev server
npm run dev
```

Visit http://localhost:3000

**Default admin credentials**
- Email: `admin@vck.org`
- Password: `Admin@12345`
- Change the password immediately after first login.

> Without AWS credentials, uploaded images are stored locally in `public/uploads/`. Set AWS vars to use S3 instead.

---

## AWS Deployment

### Architecture Overview

```
Internet → Route 53 → EC2 (Nginx + Next.js) → RDS PostgreSQL
                                             → S3 (form images)
                                             → Sarvam AI (OCR)
```

---

### 1. RDS PostgreSQL

1. Go to **AWS RDS → Create database**
2. Engine: **PostgreSQL 16**
3. Template: **Free tier** (dev) or **Production** (prod)
4. DB instance identifier: `vck-form-capture`
5. Master username: `postgres`, set a strong password
6. Instance: `db.t3.micro` (min) or `db.t3.small` (recommended)
7. Storage: 20 GB gp2
8. VPC: same VPC as your EC2 instance
9. **Publicly accessible: No** (EC2 accesses via private IP)
10. Create a security group that allows port `5432` from the EC2 security group only

After creation, note the **endpoint hostname** — used in `DATABASE_URL`.

```
DATABASE_URL="postgresql://postgres:<password>@<rds-endpoint>:5432/vck_form_capture"
```

Connect from EC2 and create the database:
```bash
psql -h <rds-endpoint> -U postgres -c "CREATE DATABASE vck_form_capture;"
```

---

### 2. S3 Bucket

1. Go to **AWS S3 → Create bucket**
2. Bucket name: `vck-form-images` (must be globally unique)
3. Region: `ap-south-1` (Mumbai)
4. Block all public access: **ON** (images accessed via presigned URLs only)
5. Enable versioning: optional

**Add CORS policy** (S3 → Permissions → CORS):
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

### 3. IAM User & Permissions

1. Go to **IAM → Users → Create user**
2. Name: `vck-app-user`
3. Attach policy — create a custom inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vck-form-images/*"
    }
  ]
}
```

4. Create **Access Key** (type: Application running on AWS compute)
5. Save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

---

### 4. EC2 Setup

1. Go to **EC2 → Launch Instance**
2. AMI: **Ubuntu 24.04 LTS**
3. Instance type: `t3.small` (minimum) or `t3.medium` (recommended)
4. Key pair: create or select existing
5. Security group — allow inbound:
   - Port 22 (SSH) from your IP
   - Port 80 (HTTP) from anywhere
   - Port 443 (HTTPS) from anywhere
6. Storage: 20 GB gp3

**SSH into the instance:**
```bash
ssh -i your-key.pem ubuntu@<ec2-public-ip>
```

**Install Node.js 20:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # should be 20.x
```

**Install other dependencies:**
```bash
sudo apt-get install -y git nginx postgresql-client
```

---

### 5. Environment Variables

Create `/etc/vck-form-capture/.env.local` on the EC2 instance:

```bash
sudo mkdir -p /etc/vck-form-capture
sudo nano /etc/vck-form-capture/.env.local
```

```env
DATABASE_URL="postgresql://postgres:<password>@<rds-endpoint>:5432/vck_form_capture"

NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"

SARVAM_API_KEY="<your-sarvam-api-key>"

AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="<your-iam-access-key>"
AWS_SECRET_ACCESS_KEY="<your-iam-secret-key>"
AWS_S3_BUCKET_NAME="vck-form-images"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

```bash
sudo chmod 600 /etc/vck-form-capture/.env.local
```

---

### 6. Deploy Application

```bash
# Clone the repository
cd /opt
sudo git clone https://github.com/viviztech/vck-election.git vck-form-capture
sudo chown -R ubuntu:ubuntu /opt/vck-form-capture
cd /opt/vck-form-capture

# Link environment file
ln -s /etc/vck-form-capture/.env.local .env.local

# Install Node.js 22 (must match local version)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies (postinstall runs prisma generate automatically)
npm ci

# Run database migrations (use deploy, not dev, in production)
npm run db:migrate:deploy

# Seed reference data (districts, constituencies, admin user)
npm run db:seed

# Build the application (prisma generate runs again before next build)
npm run build
```

---

### 7. Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/vck-form-capture
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vck-form-capture /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 8. SSL with Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Certbot will automatically update nginx config for HTTPS
sudo systemctl reload nginx
```

After SSL is set up, update `NEXTAUTH_URL` in `.env.local` to `https://yourdomain.com` and restart the app.

---

### 9. Run as Systemd Service

```bash
sudo nano /etc/systemd/system/vck-form-capture.service
```

```ini
[Unit]
Description=VCK Form Capture - Next.js App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/vck-form-capture
EnvironmentFile=/etc/vck-form-capture/.env.local
ExecStart=/usr/bin/node node_modules/.bin/next start -p 3000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable vck-form-capture
sudo systemctl start vck-form-capture
sudo systemctl status vck-form-capture
```

**Check logs:**
```bash
sudo journalctl -u vck-form-capture -f
```

**Redeploy after updates:**
```bash
cd /opt/vck-form-capture
git pull
npm ci
npm run db:migrate:deploy
npm run build
sudo systemctl restart vck-form-capture
```

---

## User Roles

| Role | Access |
|---|---|
| `USER` | Upload forms, verify own entries, export own data |
| `ADMIN` | All USER access + view all entries, admin stats |
| `SUPER_ADMIN` | All ADMIN access + manage user roles |

---

## How to Use

1. **Login** at `/login` with admin credentials
2. **Upload** a VCK membership form image at `/upload`
3. **OCR** runs automatically via Sarvam AI (Tamil language)
4. **Verify** the extracted data at the entry detail page
5. **Export** verified entries as CSV from `/export`
