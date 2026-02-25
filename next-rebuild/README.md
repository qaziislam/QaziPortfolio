# Qazi Portfolio 2027 Rebuild Prototype

This is a parallel Next.js rebuild track (`next-rebuild/`) so you can test modern architecture without disturbing the live static site.

## Stack

- Next.js 15 App Router + TypeScript
- React 19
- Framer Motion (section reveal primitives)
- Tokenized CSS system for rapid visual direction changes

## Run

```bash
cd next-rebuild
npm install
npm run dev
```

Then open `http://localhost:3001`.

## Included in this prototype

- Cinematic hero with conversion-focused CTAs
- Proof metric rail
- Reusable case-study cards with typed data model (`data/site.ts`)
- Conversion section aligned to strategic call booking
- Reusable motion primitive (`components/reveal.tsx`)

## Next migration steps

1. Move existing timeline, credentials, and tech sections into reusable blocks.
2. Replace static copy with CMS-ready schemas.
3. Add route-level pages for case studies and awards materials.
4. Introduce staged scroll choreography and component-level performance budgets.
