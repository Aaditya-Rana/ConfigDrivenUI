# Project Architecture

## Overview
This project uses a **Headless CMS architecture** with **Strapi** as the backend data provider and **Next.js** as the frontend application. The core design philosophy is "Config-Driven UI", where the page layout and content structure are defined dynamically in the CMS, and the frontend reacts to this configuration.

## System Components

### 1. Backend (Strapi)
- **Role**: Source of Truth for content and configuration.
- **Port**: 1337

### 2. Nest Backend (BFF)
- **Folder**: `nest_backend/`
- **Role**: Backend for Frontend (BFF) / Proxy Layer.
- **Port**: 3001
- **Structure**:
    - `src/strapi/`: Contains `StrapiService` and `PageController`.
- **Responsibilities**:
    - Proxies requests to Strapi.
    - Can handle additional aggregation, caching, or auth logic.
    - Exposes clean API to Frontend.

### 3. Frontend (Next.js)
- **Role**: Fetches data and renders the UI.
- **Port**: 3000

## Data Flow
1.  **Request**: User visits `/about`.
2.  **Frontend**: Calls NestJS API: `GET localhost:3001/api/pages?slug=about...`
3.  **Middleware**: `StrapiService` proxies request to Strapi: `GET localhost:1337/api/pages?...`
4.  **Backend**: Strapi filters content based on rules and returns JSON.
5.  **Render**: Frontend receives data and renders `SectionRenderer`.

## Visibility Logic
The application implements backend-side visibility filtering.
- **Visibility Rules (Backend Enforced)**:
    - `Page` and `Section` have a `visibilityRules` component.
    - Strapi `api::page.page` controller intercepts requests.
    - Filters out pages/sections based on `region`, `language`, `consent` query params.
    - **Security**: Restricted content is never sent to the client.
