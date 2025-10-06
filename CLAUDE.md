# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Words Made of Pixels is a multi-language digital book reading application built with React + TypeScript + Vite. The app displays markdown-formatted stories organized into collections, with support for multiple languages per story.

## Development Commands

- `npm run dev` - Start development server at http://localhost:5173/words_made_of_pixels/
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Architecture

### Navigation Structure

The app uses a three-level navigation hierarchy:

1. **Collections List** (`/`) - Displays folders for each collection and standalone stories
2. **Tales List** (`/collection/:collectionSlug`) - Shows text file icons for stories within a collection
3. **Tale Reader** (`/tale/:slug`) - Renders individual story content from markdown

### Data Flow & State Management

- **App.tsx** (root component) - Manages global state:
  - Fetches `_tales.json` and `_collections.json` on mount
  - Maintains `selectedLanguage` state shared across all pages
  - Passes data down as props to page components via routing

- **Shared Types** (`types.ts`) - Centralized type definitions for Tale, Collection, TalesData, and CollectionsData

- **Language Filtering** - Components filter content to only show items available in the currently selected language

### Content Management

Stories are stored as static files in `public/tales/`:

- **`_tales.json`** - Tale metadata with multi-language titles:
  ```json
  {
    "tale-slug": {
      "title": {"en": "English Title", "vi": "Vietnamese Title"},
      "author": "Author Name",
      "lastUpdated": "2025-01-01",
      "language": ["en", "vi"]
    }
  }
  ```

- **`_collections.json`** - Collection metadata grouping tales:
  ```json
  {
    "collection-slug": {
      "name": {"en": "Collection Name", "vi": "Tên bộ sưu tập"},
      "tales": ["tale-slug-1", "tale-slug-2"],
      "language": ["en", "vi"],
      "lastUpdated": "2025-01-01"
    }
  }
  ```

- **Markdown files** - Named as `{tale-slug}-{language-code}.md` (e.g., `corpse-in-dumpster-en.md`)

### File Naming Convention

- Tale slugs in metadata do NOT include language suffix
- Markdown files on disk MUST include language suffix: `{slug}-{lang}.md`
- Tale URLs include language: `/tale/{slug}-{lang}`

### UI Components

- **FolderIcon** - Visual folder representation for collections (max-width: 120px, text wraps)
- **TextFileIcon** - Document icon for individual tales (max-width: 150px, text wraps)
- **LanguageSelector** - Fixed bottom selector, only shows languages available in current context

### TypeScript Configuration

- Uses `verbatimModuleSyntax` - all type imports must use `import type { Type }` syntax
- Strict mode enabled with ES2022 target

## Deployment

Configured for GitHub Pages deployment:
- Base path: `/words_made_of_pixels/`
- All fetch requests must include this base path
- See README.md for deployment references

## Styling

Minimal CSS approach - styles in `index.css`. Avoid creating additional CSS files unless absolutely necessary.
