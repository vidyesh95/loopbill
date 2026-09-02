# Next.js 15 and above Project Coding Guidelines

## General Project Structure

- Use the App Router in `app/` by default for file-system routing and React Server Components.
- Place all static assets (images, fonts, icons) in `public/`, which maps to `/` at runtime.
- For large or monorepo setups, wrap application code in a top-level `src/` folder.
- Use the latest Next.js and react a version along with React compiler.

## Coding Conventions

- Write all code in TypeScript (`.ts` / `.tsx`) with `"strict": true` in `tsconfig.json`.
- Use `camelCase` for variables/functions, `PascalCase` for React components.
- Colocate route-specific helpers in underscore folders next to pages.
- Keep shared types and interfaces in `src/types/`.

## Code Quality:

- Clean, readable, and organized code.
- Proper use of comments and documentation where necessary.
- Adherence to best practices for both Next.js

## SEO

- Rendering Strategy
  : Prefer Static Site Generation (SSG) for content pages and Server-Side Rendering (SSR) for dynamic data to deliver
  fully rendered HTML to crawlers, leveraging Next.js 15’s improved SSR performance for better indexing and faster Time
  to First Byte.

- Metadata API Usage
  : Leverage Next.js’s built-in Metadata API in layout.tsx or page.tsx by exporting a static metadata object or an async
  generateMetadata function to define page-level <meta> and <link> tags in the HTML <head> for each route.

- Essential Meta Tags
  - title: Supply a unique, descriptive <title> via metadata.title to influence title links shown in Google Search
    results.
  - description: Use metadata.description for a concise summary (≈155–160 characters) to improve click-through rates.
  - keywords: Optionally include relevant terms via metadata.keywords.
  - robots: Control indexing per page with metadata.robots (e.g. { index: true, follow: true } or noindex) to manage which
    pages appear in search.

- Open Graph & Twitter Cards
  : Define social sharing data using metadata.openGraph and metadata.twitter, setting properties like og:title,
  og:description, og:image, twitter:card, and twitter:image to optimize how links preview on platforms like Facebook and
  X(Twitter)

- Performance Hints
  : Improve load times and preconnect key domains using metadata.dnsPrefetch and metadata.preconnect arrays to hint
  resource fetching early.

- Sitemap & robots.txt
  : Generate and serve a sitemap.xml and robots.txt at site root to communicate crawl priorities and indexation rules
  to all search engines.

- Image SEO
  : Ensure every image includes meaningful alt text via metadata.openGraph.images[].alt or inline alt attributes to
  improve accessibility and image search ranking

- Validation & Testing
  : Regularly audit site with Lighthouse’s SEO audit in Chrome DevTools and Google’s Rich Results Test to verify that all
  meta-tags, structured data, and link hints are recognized correctly.
