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
- **Translation**: Pluggable API (currently mock, supports LibreTranslate, Google Translate, etc.)
- **AI Features**: Pluggable API (currently mock, supports OpenAI, Anthropic Claude, etc.)

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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

### Translation API

To use real translation, update `src/services/translation.ts`:

```typescript
// Example with LibreTranslate
export const translateText = async (text: string, fromLang: Language, toLang: Language): Promise<string> => {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: getLanguageCode(fromLang),
      target: getLanguageCode(toLang),
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.translatedText;
};
```

### AI API

To use real AI generation, update `src/services/ai.ts`:

```typescript
// Example with OpenAI
export const generateMemorizationTip = async (...) => {
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
        content: `Generate a memorization tip...`
      }]
    })
  });
  // Parse and return response
};
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
