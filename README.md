# Config-Driven UI with Strapi & Next.js

This project demonstrates a config-driven UI architecture using Strapi as a Headless CMS and Next.js for the frontend.

## Project Structure
- `backend/`: Strapi CMS (Headless)
- `nest_backend/`: NestJS Proxy Layer (BFF)
- `frontend/`: Next.js Application

## Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

## Getting Started

### Backend (Strapi)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run develop
   ```
   The Admin UI will be available at `http://localhost:1337/admin`.

### NestJS Proxy (Middleware)
1. Navigate to the nest_backend directory:
   ```bash
   cd nest_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```
   The API Proxy will be available at `http://localhost:3001/api`.

### Frontend (Next.js)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Architecture Highlights
- **NestJS Proxy Layer**: Intercepts requests for enhanced security and logic.
- **Dynamic Zones**: Used for flexible page layouts.
- **Section Renderer**: Maps Strapi component types to Next.js components.
- **Visibility Rules**: Conditional rendering based on flag configuration.

## Documentation
- [Architecture Overview](docs/architecture.md)
- [Strapi v5 Setup Guide](docs/strapi-setup.md)
- [CMS User Guide](docs/cms-user-guide.md)
- [Developer Guide](docs/developer-guide.md)

