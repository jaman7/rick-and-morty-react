# Rick and Morty Explorer

Explore characters, episodes, and locations from the Rick and Morty universe in a modern, fast and responsive SPA built with React + TypeScript + Vite.

## Features

- React 19 with TypeScript
- Vite for fast development
- Unit tests with Vitest + Testing Library
- React Router v7
- Global state with Zustand
- AutoComplete with debounce, keyboard support & tests
- Custom Axios HttpService with interceptors (loading, locale, trace-id)
- i18n with localStorage and chained backends
- Toast notification system via `useToast`
- SCSS architecture with variables, mixins and utility classes
- Prettier + ESLint + Stylelint + Husky

## Local launch

```bash
# Clone the repository
git clone https://github.com/jaman7/rick-and-morty-react.git .

# Dependency installation
npm install

# Starting a local dev server
npm run dev

# Production build
npm run build

# Local build preview
npm run preview
```

```bash
# Tests
npm run test

# Tests UI
npm run test:ui

# The app will be available at:
[http://localhost:5173](http://localhost:5173)
```

## Architecture

```
src/
├── assests/scss/        # Global styles, mixins, utilities
├── core/services/http/  # Axios-based HTTP layer
├── hooks/               # Custom hooks
├── routes/              # Route definitions with page transitions
├── shared/components/   # Reusable UI components
└── view/pages/          # Main application pages
```

## AutoComplete Component

Debounced search using rxjs
Keyboard navigation & a11y
Tested with Vitest

## Code Quality

eslint.config.js based on TypeScript, React, Prettier, Import order, Vitest
Lint on commit with lint-staged & husky
Prettier with custom import sorting
