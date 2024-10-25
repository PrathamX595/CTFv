# CTFv

**CTFv** is a **feature-rich, cost-free CTF platform** built with ❤️ by **COPS IIT(BHU)**. Designed using serverless technologies, CTFv is scalable, secure, and **entirely free to run**.

Currently, the platform hosts *Daily Challenges* as part of an initiative to engage users with daily cybersecurity challenges. Users can solve challenges, earn points, and compete on the leaderboard.

## Platform Highlights

In the first 10 days post-launch, CTFv has seen:

- 🎉 **300+ registered users**
- 🎉 **2400+ challenge submissions**
- 📈 **Over 40k requests processed**, with a peak of **8.5k requests** in one day
- 📈 **19.85M rows read** and **6.95k rows written** in the database, handling **26.92k read** and **3.75k write queries**
- ⏰ **Zero downtime**

## Tech Stack

- **Frontend**: React with TailwindCSS & shadCN UI for a clean and responsive design.
- **Backend**: Hono.js running on Cloudflare Workers with a Cloudflare D1 SQLite database and Drizzle as the ORM.

## Setup

This project is organized as a mono-repo with two main packages: **ctfv-frontend** and **ctfv-backend**. Follow the steps below to get started:

1. **Install dependencies**: In the root directory, run:

   ```bash
   bun install
   ```

2. **Setup the database**:
   - Navigate to `packages/ctfv-backend` and run:

     ```bash
     bun run migration:local
     ```

   - Copy `.dev.vars.example` to `.dev.vars` in `ctfv-backend` and configure as needed.

3. **Run the application**:
   - In the root directory, start both the backend and frontend with:

     ```bash
     bun run dev
     ```

4. **Maintain the database**:
   - Periodically, update the database schema:

     ```bash
     bun run migration:local
     ```

   - To reset the database, use:

     ```bash
     bun run clean
     ```

5. **Populate the database**:
   - To add sample data (1 admin, 19 non-admin accounts, and 35 challenges), navigate to `packages/ctfv-backend` and run:

     ```bash
     bun run populate:local
     ```

   - You may need to clear the database and reapply migrations before populating.

6. **Accessing the Admin Account**:
   - Login credentials for the admin account are:
     - **Email**: `ADMIN@iitbhu.ac.in`
     - **Password**: `cops` (used for all accounts)

For further details, refer to [`./packages/ctfv-backend/src/db/populate.sql`](./packages/ctfv-backend/src/db/populate.sql).
