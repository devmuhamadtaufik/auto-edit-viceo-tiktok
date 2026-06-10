# Design System

## Brand

This is a personal TikTok video automation tool. The UI should feel clean, modern, and focused — like a professional video editing dashboard, not a consumer social media app.

## Color Palette

### Primary
- **Primary**: Slate (`slate-900` for backgrounds, `slate-100` for surfaces)
- **Accent**: Violet (`violet-600` for primary actions, `violet-500` for hover)

### Semantic
- **Success**: Emerald (`emerald-500`)
- **Warning**: Amber (`amber-500`)
- **Error**: Red (`red-500`)
- **Info**: Sky (`sky-500`)

### Usage
- Dark sidebar and header backgrounds: `slate-900`
- Main content area: `slate-50`
- Cards and panels: white with `border-slate-200`
- Primary buttons: `violet-600` with white text
- Secondary buttons: `slate-100` with `slate-700` text

## Typography

- **Font**: Inter (sans-serif)
- **Headings**: `font-semibold`, tracking tight
- **Body**: `text-sm` default, `text-base` for longer content
- **Monospace**: JetBrains Mono for code, logs, and technical data

### Scale
- `text-xs` — labels, badges, metadata
- `text-sm` — body text, form inputs, table cells
- `text-base` — long-form content, descriptions
- `text-lg` — card titles
- `text-xl` — section headers
- `text-2xl` — page titles

## Components

All components come from shadcn-ui. Reference: https://www.shadcn-svelte.com/

### Commonly Used
- **Button** — `variant`: default (violet), secondary (slate), destructive (red), outline, ghost
- **Card** — white background, `border-slate-200`, `shadow-sm`
- **Input** — standard shadcn input with `text-sm`
- **Select** — dropdown for filters and options
- **Dialog** — for confirmations and forms
- **Toast** — for notifications (job complete, error, etc.)
- **Badge** — for status indicators (queued, processing, done, error)
- **Table** — for listing videos, jobs, and logs
- **Tabs** — for switching between views (dashboard, queue, history)
- **Progress** — for showing FFmpeg job progress

## Layout

### Shell
- **Sidebar** (left, 240px): Navigation links, collapsed on mobile
- **Header** (top, 56px): Page title, breadcrumbs, global actions
- **Main** (remaining space): Scrollable content area

### Spacing
- Section padding: `p-6`
- Card padding: `p-4`
- Gap between cards: `gap-4`
- Form field gap: `gap-4`

## States

### Loading
- Use shadcn Skeleton components for content loading
- Use spinner icon (Lucide `Loader2` with `animate-spin`) for button loading states

### Empty
- Show a centered illustration or icon with descriptive text
- Always include a clear CTA to create the first item

### Error
- Use `Destructive` variant buttons for retry actions
- Show error messages in `text-red-600` on `bg-red-50` background

## Icons

Use Lucide icons exclusively (bundled with shadcn-ui). Common icons:
- `Video`, `Film` — video-related
- `Upload`, `Download` — file operations
- `Play`, `Pause`, `StopCircle` — job control
- `CheckCircle`, `XCircle`, `AlertTriangle` — status
- `Settings`, `Sliders` — configuration
- `Plus`, `Trash2`, `Pencil` — CRUD actions

## Accessibility

- All interactive elements must have visible focus states (`focus-visible:ring-2`)
- Form inputs must have labels
- Color is never the only indicator of state — use icons and text alongside
- Maintain minimum 4.5:1 contrast ratio for body text
