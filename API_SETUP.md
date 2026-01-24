# 🔑 API Key Setup Guide

## Quick Start (2 minutes)

The AI features (💡 Memorization Tips and 📝 Example Sentences) require a free Google Gemini API key.

### Step 1: Get Your Free API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API key"** button
4. Click **"Create API key in new project"** (or select existing project)
5. **Copy** the API key (starts with `AIza...`)

### Step 2: Add API Key to Your Project

1. In the project root directory, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file and add your key:
   ```
   VITE_GEMINI_API_KEY=AIzaSy...paste_your_key_here
   ```

3. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## ✅ Verify It's Working

1. Open the app in your browser
2. Go to "Add Word"
3. Fill in a word and translation
4. Click the **💡 AI** button
5. You should see a smart memorization tip (not a fallback message)!

## 🆓 Is It Really Free?

**YES!** Google Gemini API offers:
- **1,500 requests per day** (free tier)
- No credit card required
- Perfect for personal vocabulary learning

## ❓ Troubleshooting

### Still seeing fallback messages?

1. **Check your `.env` file:**
   - Make sure it's in the project ROOT directory (same level as `package.json`)
   - File name is exactly `.env` (not `.env.txt`)
   - API key has no quotes or extra spaces

2. **Verify the API key:**
   - Should start with `AIza`
   - No spaces before or after
   - Example format:
     ```
     VITE_GEMINI_API_KEY=AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q
     ```

3. **Restart the dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

4. **Check the browser console** (F12) for error messages

### API key not working?

- Make sure you created the key at: https://aistudio.google.com/app/apikey
- NOT the Google Cloud Console (different service)
- Try generating a new key

## 🔒 Security Note

- Never commit your `.env` file to git (it's already in `.gitignore`)
- Never share your API key publicly
- The key only works for Gemini API, it's safe for personal use

## 📞 Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Verify your API key at https://aistudio.google.com/app/apikey
3. Try creating a new API key
