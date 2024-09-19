# CTFv

## Setup

The repository is in a mono-repo format. The packages directory contains the two packages, ctfv-frontend and ctfv-backend. The frontend is a React app and the backend is a Hono.js app.

- First `bun install` in the root directory to install the dependencies.
- Then in `packages/ctfv-backend`, run `bun run migration:local` to setup the database.
- And then in `packages/ctfv-backend`, add the .dev.vars file (copy it from the .dev.vars.example).

- Then from the root directory, run `bun run dev` to start both the backend and frontend.
