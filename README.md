# Vocabulary Flashcards Web App

A lightweight web application for vocabulary memorization using flip-style flashcards and spaced repetition learning.

## Features

### 📝 Add Vocabulary Words
- **Multi-language support**: Choose from Chinese, English, and Japanese
- **Flexible input**: Select input and output languages independently
- **Text-to-Speech**: Hear pronunciation of words with a sound button
- **Auto-translation**: Click a button to automatically translate words
- **AI-powered tips**: Generate memorization tips in the output language
- **Example sentences**: Get AI-generated example sentences in the input language

### 🎴 Review with Flashcards
- **Flip-style cards**: Interactive flip animation to reveal translations
- **Progress tracking**: Visual progress bar shows your review session
- **Additional info**: View memorization tips and example sentences on the back

### 🧠 Spaced Repetition System
- **Three familiarity levels**:
  - 😕 **Not Familiar**: Review tomorrow (1 day)
  - 🤔 **Little Familiar**: Review in 2 days
  - 😊 **Very Familiar**: Progressive intervals (3, 4, 7, 14, 30 days)
- **Smart scheduling**: Words are automatically scheduled based on your familiarity level
- **Signal bar visualization**: Easy-to-understand familiarity indicator

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Storage**: LocalStorage (client-side)
- **Text-to-Speech**: Web Speech API
- **Translation**: MyMemory Translation API (free, no API key required)
- **AI Features**: HuggingFace Inference API (free tier available with optional API key)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vocabulary_web
```

2. Install dependencies:
```bash
npm install
```

3. **(Optional) Set up API key for AI features:**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Get a free HuggingFace API key:
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Copy the token
   - Add it to your `.env` file:
   ```
   VITE_HUGGINGFACE_API_KEY=your_api_key_here
   ```

   **Note:** Translation works without any API key. AI features will provide fallback responses if no key is provided, but work better with an API key.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
vocabulary_web/
├── src/
│   ├── components/          # React components
│   │   ├── AddWord.tsx     # Form for adding new words
│   │   ├── FlashCard.tsx   # Flip-style flashcard
│   │   └── FamiliaritySelector.tsx  # Familiarity level selector
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page with stats
│   │   ├── AddWordPage.tsx # Add word page
│   │   └── ReviewPage.tsx  # Review session page
│   ├── services/           # Business logic and APIs
│   │   ├── storage.ts      # LocalStorage service
│   │   ├── spacedRepetition.ts  # Spaced repetition algorithm
│   │   ├── translation.ts  # Translation service
│   │   ├── ai.ts          # AI generation service
│   │   └── textToSpeech.ts # Text-to-speech service
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts       # Core types
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # TailwindCSS configuration
```

## API Integration

### Translation API - ✅ Working Now!

The app uses **MyMemory Translation API** which is:
- ✅ **Free** - No cost or subscription needed
- ✅ **No API key required** - Works immediately out of the box
- ✅ **Supports 50+ languages** - Including Chinese, English, and Japanese
- 📍 Located in: `src/services/translation.ts`

The translation feature works immediately without any setup!

### AI Generation API - ✅ Working Now!

The app uses **HuggingFace Inference API** with the Mistral-7B model:

**Without API key (Free):**
- ✅ Works with limited rate limits
- ✅ Provides fallback responses if rate limited
- 📍 Located in: `src/services/ai.ts`

**With API key (Better):**
1. Get a free API key at https://huggingface.co/settings/tokens
2. Add to `.env` file:
   ```
   VITE_HUGGINGFACE_API_KEY=your_key_here
   ```
3. Enjoy higher rate limits and better performance!

### Alternative: Use OpenAI (Optional)

If you prefer OpenAI, you can modify `src/services/ai.ts`:

```typescript
// Example with OpenAI API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: prompt
    }]
  })
});
```

## Data Storage

The app uses browser LocalStorage to persist data. Data includes:
- Vocabulary words
- Review progress and scheduling
- Familiarity levels

To clear all data, open browser console and run:
```javascript
localStorage.clear()
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- Text-to-Speech availability varies by browser and OS

## Future Enhancements

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Import/export word lists
- [ ] Statistics and analytics
- [ ] Achievement system
- [ ] Custom categories/tags
- [ ] Study streak tracking
- [ ] Dark mode

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
