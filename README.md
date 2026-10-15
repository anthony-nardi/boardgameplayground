# Board Game Playground

Landing site for a collection of board games with AI opponents, plus the TZAAR
implementation itself (a two player GIPF-series game with a minimax bot).

The other games link out to sibling apps:

- Family Inc. — `../familyinc` (Next.js client + NestJS socket server)
- High Society and No Thanks! — `../high-society` (Vite + Firebase)

## Stack

Next.js 16 (pages router), React 19, Mantine 9, TypeScript 6, Vitest 5.
Requires Node 22 or newer.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest: TZAAR board, move generation, evaluation and turn logic
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # next build
```

## Running everything locally

`scripts/dev-all.ps1` starts this app, both Family Inc. processes, the High
Society client and the Firebase emulators, each in its own window. It assumes
the three repositories are sibling checkouts.

In development the landing page links to the local apps via
`.env.development` (Family Inc. on port 3033, High Society on 5173). Production
builds use the deployed URLs.
