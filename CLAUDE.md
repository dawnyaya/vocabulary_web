# CLAUDE.md - AI Assistant Guide for Vocabulary Web

## Project Overview

**vocabulary_web** is a web-based vocabulary learning application designed to help users build and retain vocabulary knowledge through interactive exercises and spaced repetition.

### Repository Information
- **Repository**: dawnyaya/vocabulary_web
- **Type**: Web Application
- **Status**: Initial Setup Phase

---

## Codebase Structure

### Recommended Project Structure

```
vocabulary_web/
├── src/
│   ├── components/          # React/Vue components
│   │   ├── common/         # Shared UI components
│   │   ├── vocabulary/     # Vocabulary-specific components
│   │   ├── exercises/      # Exercise/quiz components
│   │   └── user/           # User profile/auth components
│   ├── pages/              # Page-level components
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── services/           # API and business logic
│   │   ├── api/           # API client functions
│   │   ├── vocabulary/    # Vocabulary management
│   │   └── spaced-repetition/ # Learning algorithm
│   ├── store/              # State management (Redux/Zustand)
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles and themes
│   ├── assets/             # Static assets
│   └── config/             # Configuration files
├── public/                 # Public static files
├── tests/                  # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
└── config files            # Root configuration files
```

### Current State
- Repository is currently empty and in initial setup phase
- No existing codebase to preserve

---

## Technology Stack Recommendations

### Frontend Framework
- **Primary**: React 18+ with TypeScript
- **Alternative**: Vue 3 with TypeScript
- **Build Tool**: Vite (fast, modern)
- **Styling**: Tailwind CSS or styled-components

### State Management
- **Light**: React Context + hooks
- **Medium**: Zustand
- **Complex**: Redux Toolkit

### Backend/API
- **Option 1**: Firebase (quick setup, real-time)
- **Option 2**: Supabase (PostgreSQL, open-source)
- **Option 3**: Node.js/Express with PostgreSQL

### Key Libraries
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **HTTP Client**: Axios or TanStack Query
- **Animation**: Framer Motion
- **Icons**: React Icons or Lucide
- **Date**: date-fns or Day.js
- **Testing**: Vitest, Testing Library, Playwright

---

## Development Workflow

### Branch Strategy
- **Main Branch**: `main` or `master` - production-ready code
- **Feature Branches**: `feature/feature-name`
- **Bug Fixes**: `fix/bug-description`
- **AI Development**: `claude/session-id` - AI assistant work

### Development Process
1. **Fetch latest changes** from main branch
2. **Create feature branch** from main
3. **Develop and test** locally
4. **Commit with clear messages** (see conventions below)
5. **Push to remote** branch
6. **Create Pull Request** for review
7. **Merge** after approval

### Local Development Setup
```bash
# Clone repository
git clone <repository-url>
cd vocabulary_web

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Code Conventions

### File Naming
- **Components**: PascalCase - `VocabularyCard.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Hooks**: camelCase with 'use' prefix - `useVocabulary.ts`
- **Types**: PascalCase - `VocabularyTypes.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`
- **Tests**: Match source file - `VocabularyCard.test.tsx`

### Code Style
- **Language**: TypeScript for all code
- **Formatting**: Prettier (consistent)
- **Linting**: ESLint with TypeScript rules
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Yes (consistent)
- **Line Length**: 100 characters max

### Component Structure
```typescript
// VocabularyCard.tsx
import { FC } from 'react';

interface VocabularyCardProps {
  word: string;
  definition: string;
  example?: string;
  onFlip?: () => void;
}

export const VocabularyCard: FC<VocabularyCardProps> = ({
  word,
  definition,
  example,
  onFlip
}) => {
  // Hooks at the top
  // Event handlers
  // Render logic

  return (
    <div className="vocabulary-card">
      {/* Component JSX */}
    </div>
  );
};
```

### TypeScript Guidelines
- **Always** define types for component props
- **Use** interfaces for object shapes
- **Use** type aliases for unions and primitives
- **Avoid** `any` - use `unknown` if type is truly unknown
- **Enable** strict mode in tsconfig.json
- **Export** types from a central location when shared

### Git Commit Messages
Follow conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(vocabulary): add spaced repetition algorithm
fix(auth): resolve login token expiration issue
docs(readme): update setup instructions
refactor(components): simplify VocabularyCard logic
```

---

## Testing Standards

### Test Coverage
- **Unit Tests**: All utility functions, hooks, services
- **Component Tests**: All components with user interactions
- **Integration Tests**: API calls, state management flows
- **E2E Tests**: Critical user journeys

### Testing Principles
- **Write tests before fixing bugs** (TDD for bugs)
- **Test behavior, not implementation**
- **Keep tests simple and readable**
- **Mock external dependencies**
- **Use descriptive test names**

### Test Structure
```typescript
describe('VocabularyCard', () => {
  it('should display word and definition', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should call onFlip when card is clicked', () => {
    // Test implementation
  });
});
```

---

## Key Features to Implement

### Core Features
1. **Vocabulary Management**
   - Add/edit/delete vocabulary words
   - Organize by categories/tags
   - Import/export word lists

2. **Learning System**
   - Flashcard review
   - Spaced repetition algorithm (SM-2 or similar)
   - Progress tracking
   - Difficulty levels

3. **Exercises**
   - Multiple choice quizzes
   - Fill in the blanks
   - Matching exercises
   - Sentence construction

4. **User System**
   - Authentication (email/social)
   - Personal vocabulary lists
   - Learning statistics
   - Achievement system

5. **Search & Filter**
   - Search vocabulary
   - Filter by category, difficulty, status
   - Sort options

### Data Models

#### Vocabulary Word
```typescript
interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
  pronunciation?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### User Progress
```typescript
interface UserProgress {
  userId: string;
  wordId: string;
  reviewCount: number;
  correctCount: number;
  lastReviewed: Date;
  nextReview: Date;
  easeFactor: number; // For spaced repetition
  interval: number; // Days until next review
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
}
```

---

## AI Assistant Guidelines

### When Working on This Project

1. **Read Before Writing**
   - Always read existing files before modifying
   - Understand current patterns and conventions
   - Maintain consistency with existing code

2. **Plan Before Implementing**
   - Use TodoWrite for multi-step tasks
   - Break down complex features into smaller tasks
   - Mark tasks as in_progress/completed accurately

3. **Code Quality**
   - Write TypeScript, not JavaScript
   - Add proper type definitions
   - Follow existing code style
   - Write self-documenting code
   - Add comments only for complex logic

4. **Testing**
   - Write tests for new features
   - Update tests when modifying code
   - Run tests before committing
   - Ensure no regressions

5. **Git Practices**
   - Commit logical units of work
   - Write clear commit messages
   - Push to correct branch (claude/* for AI work)
   - Don't commit sensitive data or secrets

6. **Security Considerations**
   - Validate all user input
   - Sanitize data before display (XSS prevention)
   - Use parameterized queries (SQL injection prevention)
   - Implement proper authentication/authorization
   - Never store passwords in plain text
   - Use HTTPS for API calls

7. **Performance**
   - Optimize re-renders (React.memo, useMemo, useCallback)
   - Lazy load components and routes
   - Implement pagination for large lists
   - Use debouncing for search/input
   - Optimize images and assets

8. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation
   - Maintain color contrast ratios
   - Add alt text for images

9. **Don't Over-Engineer**
   - Implement what's requested, not more
   - Keep solutions simple and focused
   - Avoid premature optimization
   - Don't add features not requested

### Common Tasks

#### Adding a New Component
1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Implement component with proper hooks
4. Add styles (inline or separate file)
5. Export from index.ts if needed
6. Write tests for component
7. Update parent component to use it

#### Adding a New API Endpoint
1. Define request/response types
2. Create service function in services/api/
3. Add error handling
4. Add loading states
5. Write integration test
6. Update relevant components

#### Adding a New Page
1. Create page component in pages/
2. Add route in router configuration
3. Implement page layout and content
4. Add navigation link if needed
5. Test routing and navigation

### File References
When referencing code, use the format: `file_path:line_number`
Example: "The authentication logic is in src/services/auth.ts:45"

---

## Environment Variables

### Required Environment Variables
```bash
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_api_key

# Authentication (Firebase/Supabase)
VITE_AUTH_DOMAIN=your_auth_domain
VITE_AUTH_PROJECT_ID=your_project_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_BETA_FEATURES=false
```

### Environment Files
- `.env.development` - Local development
- `.env.production` - Production build
- `.env.test` - Test environment
- `.env.example` - Template (commit this)

**Never commit actual .env files** - add to .gitignore

---

## Deployment

### Build Process
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms
- **Vercel**: Recommended for quick deployment
- **Netlify**: Good alternative with form handling
- **GitHub Pages**: Static hosting option
- **AWS S3 + CloudFront**: Full control

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Build succeeds without errors
- [ ] Lighthouse score reviewed (Performance, Accessibility, SEO)
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

---

## Resources & Documentation

### Learning Resources
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **Testing Library**: https://testing-library.com

### Spaced Repetition
- **SM-2 Algorithm**: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
- **Anki's Algorithm**: Study existing implementations

### Design Inspiration
- **Duolingo**: Gamification and UX
- **Quizlet**: Flashcard interface
- **Memrise**: Spaced repetition UI

---

## Troubleshooting

### Common Issues

**Build Failures**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node version: `node --version` (use LTS version)

**Type Errors**
- Ensure all dependencies have types: `npm install --save-dev @types/package-name`
- Check tsconfig.json for strict settings
- Use type assertions carefully

**Test Failures**
- Clear test cache: `npm test -- --clearCache`
- Check for async issues (missing await)
- Ensure proper mocking of dependencies

---

## Project Status & Next Steps

### Current Status
- ✅ Repository initialized
- ⏳ Project setup pending
- ⏳ Technology stack to be finalized
- ⏳ Initial development to begin

### Immediate Next Steps
1. **Initialize Project**
   - Set up Vite + React + TypeScript
   - Configure ESLint and Prettier
   - Set up Git hooks (Husky)
   - Create initial folder structure

2. **Core Setup**
   - Set up routing
   - Configure state management
   - Set up API client
   - Create design system/theme

3. **First Features**
   - User authentication
   - Vocabulary CRUD operations
   - Basic flashcard component
   - Simple quiz functionality

---

## Questions & Support

### For AI Assistants
- **Unclear requirements?** Ask the user for clarification
- **Multiple approaches?** Present options with trade-offs
- **Breaking changes?** Explain impact and get confirmation
- **Complex implementation?** Break into smaller tasks with TodoWrite

### For Developers
- Check existing issues in GitHub repository
- Review closed PRs for implementation examples
- Refer to this CLAUDE.md for conventions
- Update this document as project evolves

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
**Maintainer**: AI Assistant (Claude)
