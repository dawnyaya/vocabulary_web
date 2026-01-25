# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for Memoloop.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "memoloop")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app:
   - App nickname: "Memoloop Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
3. **Copy the Firebase configuration** - you'll need these values for your `.env` file

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Click "Google" from the list
5. Toggle "Enable"
6. Select your project support email
7. Click "Save"

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select **Start in production mode** (we'll add rules next)
4. Choose a location (pick one closest to your users)
5. Click "Enable"

## Step 5: Configure Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration in `.env`:

```env
# From your Firebase config object
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 7: Add Authorized Domains (for Production)

1. In Firebase Console, go to **Build** → **Authentication** → **Settings**
2. Scroll to "Authorized domains"
3. Add your production domain(s) (e.g., `your-app.vercel.app`)

## Step 8: Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173`
3. Click "Continue with Google"
4. Sign in with your Google account
5. Check Firestore console to see your user data being created

## Data Structure

Memoloop uses the following Firestore structure:

```
users/
  {userId}/
    words/
      {wordId}/
        - word: string
        - translation: string
        - inputLanguage: string
        - outputLanguage: string
        - memorizationTip?: string
        - exampleSentence?: string
        - createdAt: Timestamp
        - updatedAt: Timestamp

    progress/
      {wordId}/
        - wordId: string
        - reviewCount: number
        - correctCount: number
        - lastReviewed: Timestamp
        - nextReview: Timestamp
        - easeFactor: number
        - interval: number
        - status: string
```

## Troubleshooting

### Authentication Popup Blocked
- Make sure popup blockers are disabled for your domain
- Use incognito/private mode to test
- Check browser console for errors

### Permission Denied Errors
- Verify Firestore security rules are correct
- Check that user is signed in (`user` is not null)
- Ensure `userId` matches `auth.uid`

### Configuration Errors
- Double-check all env variables are correct
- Restart dev server after changing `.env`
- Verify Firebase project is active

## Security Best Practices

1. **Never commit `.env` file** - it's already in `.gitignore`
2. **Use Firebase Security Rules** to protect user data
3. **Validate data** on the client before saving
4. **Set up billing alerts** in Firebase Console
5. **Monitor usage** in Firebase Console → Usage and billing

## Next Steps

- Set up Firebase Hosting for deployment
- Configure custom domain
- Set up Cloud Functions for advanced features
- Add email/password authentication (optional)
- Implement data backup strategy

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs)
