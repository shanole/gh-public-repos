# GitHub Public Repos

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4-purple?logo=vite)
![Express](https://img.shields.io/badge/Express-4-black?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![GitHub API](https://img.shields.io/badge/GitHub%20API-v3-black?logo=github)

## Description

This is a full-stack application that displays the last updated 20 open-source (MIT license) public repositories from the GitHub API in a list.

### Features

- Fetch the latest 20 MIT-licensed public GitHub repos
- Sort by star count (low → high, high → low)
- Filter by primary languages found in the results
- Click an owner to view all repos from that user in a side drawer
- Paginated fetching for owner repositories

Built with Express.js (backend) and React + Vite + TypeScript (frontend). I utilized Material UI and TailwindCSS to make it presentable.

## Setup Instructions

### Requirements

1. Node.js (version 18+, I used v20.19.0)
1. npm

### Environment variables

1. Create a `services/.env` file with:

   ```
   GITHUB_TOKEN=<optional_gh_access_token>
   PORT=8000
   ```

   The `GITHUB_TOKEN` is optional but recommended to avoid API rate limits

### Run project

1. Install all dependencies from the root folder:
   ```bash
   npm install
   cd service && npm install
   cd ../client && npm install
   cd ..
   ```
1. Run project from the root folder:

   ```bash
   npm run dev
   ```

   This will
   - Start the Express API on `http://localhost:8000`
   - start the React frontend on `http://localhost:3000`

1. Open the application in your browser:
   ```
   http://localhost:3000
   ```

### UI Test

```bash
npm run test:client
```

## AI Usage Statement

I utilized ChatGPT and the GitHub Copilot assistant in VS Code for the following tasks:

- Navigating GitHub API and formulating requests when building Express service
- Styling UI with MatUI components and Tailwind classes
- In-line code suggestions/typo catching
- Help with vitest config and syntax
