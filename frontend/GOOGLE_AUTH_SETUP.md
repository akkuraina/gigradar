# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Save your **Client ID** and **Client Secret**

## Step 3: Set Environment Variables

Create a `.env.local` file in your `frontend` directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Step 4: Generate NextAuth Secret

Generate a random secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use any random string (at least 32 characters).

## Step 5: Test the Setup

1. Start your frontend: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the redirect URI in Google Cloud Console matches exactly
- **"Client ID not found"**: Check that your environment variables are set correctly
- **"OAuth consent screen"**: You may need to configure the OAuth consent screen in Google Cloud Console

## Security Notes

- Never commit your `.env.local` file to version control
- Use different credentials for development and production
- Regularly rotate your secrets
- Add `.env.local` to your `.gitignore` file
