# Content Creation Frontend

A modern React TypeScript application for processing blog URLs and managing content creation workflows.

## Features

- **Blog URL Processing**: Submit blog URLs to be processed by the backend API
- **Real-time Status**: Track processing status with visual indicators  
- **Posts Management**: View and manage all processed posts
- **Modern UI**: Clean, responsive design with loading states and error handling
- **TypeScript**: Full type safety throughout the application

## API Endpoints

The frontend connects to the following backend endpoints:

- `POST /create_post_from_blog` - Submit a blog URL for processing
- `GET /get_all_posts` - Retrieve all processed posts

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (current version warnings can be ignored for development)
- Backend API server running on `http://localhost:8000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Backend Integration

This frontend is designed to work with a backend that:

1. **Accepts blog URLs** via POST request to `/create_post_from_blog`
2. **Processes content** for a few minutes (long-running operation)
3. **Stores results** in MongoDB
4. **Provides access** to all posts via `/get_all_posts`

Make sure your backend API is running on `http://localhost:8000` before using the frontend.

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Axios** for API requests
- **CSS3** with modern styling and animations
- **ESLint** for code quality

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
