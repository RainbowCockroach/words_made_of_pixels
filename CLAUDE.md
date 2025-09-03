# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Words Made of Pixels is a digital book reading application built with React + TypeScript + Vite. The app displays markdown-formatted novels/books stored in the `public/tales/` directory and renders them as HTML using the Showdown library.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Architecture

### Content Management

- **Book Metadata**: `public/tales/_tales.json` contains book catalog with title, author, year
- **Book Content**: Individual markdown files in `public/tales/` named as `{slug}.md`
- **Rendering**: Client-side markdown to HTML conversion using Showdown library

### Application Structure

- **App.tsx**: Main component handling book list display and content rendering
- **State Management**: React hooks only (useState, useEffect) - no external state library
- **Data Flow**: Fetch books JSON → Display list → Load selected book markdown → Render HTML

### File Organization

```
public/tales/          # Book content (served as static files)
├── _tales.json        # Book metadata catalog
└── *.md              # Individual book markdown files

src/
├── App.tsx           # Main application component
├── main.tsx          # React entry point
└── *.css             # Minimal styling files
```

## Configuration Details

### Vite Setup

- Base path configured for GitHub Pages: `/words_made_of_pixels/`
- When adding fetch requests, include the base path: `/words_made_of_pixels/tales/...`

### TypeScript

- Strict mode enabled with ES2022 target
- Separate configs for app (`tsconfig.app.json`) and Node (`tsconfig.node.json`)

### ESLint

- Modern flat config format with React Hooks and TypeScript support

## Content Management Pattern

Books are added by:

1. Adding markdown file to `public/tales/{slug}.md`
2. Adding entry to `public/tales/_tales.json` with matching slug as key
3. JSON structure: `{"slug": {"title": "...", "author": "...", "year": 2024}}`

## Deployment

Configured for GitHub Pages deployment with proper base path. The app expects to be served from `/words_made_of_pixels/` subdirectory.
