# Coffee Notes

A responsive coffee discovery website inspired by the supplied ceramics website recording: oversized editorial typography, linen-inspired photography, terracotta and ivory sections, and gentle scroll reveals.

## Develop

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

## Validate

```sh
npm run build
npm test
```

The browser smoke test expects the development server on port 5173 and uses `/usr/bin/chromium` by default. Set `CHROMIUM_PATH` for another installed Chromium executable.

## Stack and behavior

React, TypeScript, Vite, Tailwind CSS 4. Fonts are bundled locally. Coffee facts live in `src/main.tsx` with reference links. Saved notes stay in local browser storage; no account or backend is required. Includes topic filters, saved-note filtering, random discovery, keyboard-accessible modal dialogs, expandable journey and FAQ sections, and reduced-motion support.

Editorial summaries are introductory and should receive a content review before publication. Source pages were not independently fetched during this build because research domains are unavailable in this environment.

The hero photograph is an AI-generated asset created for this project. The supplied recording was used as a layout and motion reference; its embedded branding and promotional overlays are not included.

In the managed cloud environment, use `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` because the default home cache is not writable.
