# Annotator

A browser-based document annotation tool built with Angular 21. Create articles, highlight text passages, and attach color-coded notes — all persisted locally in your browser.

## Features

- Create, edit, and delete articles
- Select text to create annotations with custom notes and colors
- Overlapping annotation support with correct highlight rendering
- Annotation side panel and hover tooltips
- All data stored in `localStorage` (no backend required)

## Getting Started

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build to dist/
npm test         # run tests with Vitest
```

## Architecture

Single-page Angular app with signal-driven navigation. `App` owns `selectedArticle` and `viewMode` signals; child components emit events to update them.

### Components

| Component | Role |
|-----------|------|
| `ArticleList` | Sidebar listing articles; triggers select/create/delete |
| `ArticleViewer` | Renders article content with highlighted annotations |
| `ArticleEditor` | Form for creating/editing articles |
| `AnnotationDialog` | Modal for creating/editing an annotation |
| `AnnotationsPanel` | Side panel listing all annotations for the current article |
| `AnnotationTooltip` | Hover tooltip over highlighted text |
| `EmptyState` | Landing view when no article is selected |

### Services

- **`StorageService`** — thin `localStorage` wrapper (JSON serialization)
- **`ArticleService`** (`providedIn: 'root'`) — manages articles, persisted under key `annotator_articles`
- **`AnnotationService`** (scoped to `ArticleViewer`) — manages annotations, persisted under key `annotator_annotations`

### Annotation Rendering

`ArticleViewer.renderHighlights` rebuilds `innerHTML` on each change using an event-sweep algorithm (sorted open/close offset events) to correctly render overlapping annotations as `<mark>` elements with `data-ann-id` attributes.

Offsets (`startOffset`/`endOffset`) are character positions into `article.content` plain text, computed via a `TreeWalker` traversal in `text.utils.ts`.

## Tech Stack

- Angular 21 (standalone components, Signals API)
- RxJS 7
- Vitest for testing
- Prettier for formatting