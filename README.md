# Innonsh SprintOS

An enterprise-grade internal product management system combining features of Jira, Azure DevOps, and Agile Management platforms.

## Overview
Innonsh SprintOS is a comprehensive platform for:
- Sprint Planning
- Task Assignments
- Daily Standups
- Developer Accountability
- Blockers & Impediments Tracking
- Sprint Retrospectives
- Team Analytics

## Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui, Zustand, React Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker, GitHub Actions

## Project Structure
- `/frontend` - React SPA
- `/backend` - Express REST API
- `/docker` - Docker configurations
- `/docs` - Project documentation

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`

3. **Start with Docker (Recommended for DB)**
   ```bash
   docker-compose up -d db
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

## License
Proprietary
