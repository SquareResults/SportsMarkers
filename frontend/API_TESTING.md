# API Testing Guide

This document explains how to test the SportsMarkers API endpoints using the provided test scripts.

## Prerequisites

- Node.js installed
- Development server running (`npm run dev`)
- Supabase project configured

## Test Scripts

### 1. File Upload API Test (`test-api.sh`)

Tests the `/api/upload` endpoint for file uploads to S3.

**Basic Usage:**
```bash
./test-api.sh
```

**With Authentication:**
```bash
# Get your session token from browser DevTools after logging in
# Application > Cookies > sb-access-token
export AUTH_TOKEN='your-session-token-here'
./test-api.sh
```

**What it tests:**
- ✓ Unauthenticated requests are rejected (401)
- ✓ Authenticated file uploads work (200)
- ✓ Requests without files are rejected (400)

---

### 2. Portfolio API Test (`test-portfolio-api.mjs`)

Tests portfolio creation using the Supabase client.

**Basic Usage:**
```bash
node test-portfolio-api.mjs
```

**With Authentication:**
```bash
export SUPABASE_USER_EMAIL='your-email@example.com'
export SUPABASE_USER_PASSWORD='your-password'
node test-portfolio-api.mjs
```

**What it tests:**
- ✓ User authentication
- ✓ Portfolio creation with valid data
- ✓ Rejection of missing required fields
- ✓ Email format validation
- ✓ Automatic cleanup of test data

---

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
S3_BUCKET_NAME=your-bucket-name

# Test Credentials (optional, for automated testing)
SUPABASE_USER_EMAIL=test@example.com
SUPABASE_USER_PASSWORD=test-password
```

---

## Manual API Testing with cURL

### Upload a File

```bash
# 1. Get your session token from browser after logging in
# 2. Create a test file
echo "Test content" > test.txt

# 3. Upload the file
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -F "file=@test.txt"
```

**Expected Response:**
```json
{
  "message": "File uploaded successfully",
  "data": [{
    "id": 123,
    "file_url": "https://bucket.s3.region.amazonaws.com/filename.txt",
    "name": "test.txt",
    "user_id": "user-uuid"
  }]
}
```

---

## Common Issues

### 401 Unauthorized
- **Cause**: Missing or invalid session token
- **Solution**: Log in to the app and get a fresh token from browser cookies

### 400 Bad Request
- **Cause**: Missing file in upload request
- **Solution**: Ensure the file is included in the form data

### 500 Internal Server Error
- **Cause**: AWS S3 or Supabase configuration issue
- **Solution**: Check environment variables and AWS credentials

---

## Testing Checklist

- [ ] File upload without auth returns 401
- [ ] File upload with auth returns 200
- [ ] Portfolio creation with valid data succeeds
- [ ] Portfolio creation without required fields fails
- [ ] Invalid email format is rejected
- [ ] Test data is cleaned up after tests

---

## Next Steps

For integration testing, see the Jest test suite in:
- `src/components/auth/__tests__/CreateProfileForm.test.tsx`
