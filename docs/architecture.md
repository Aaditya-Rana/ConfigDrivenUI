# Project Architecture

## Overview
This project uses a **Headless CMS architecture** with **Strapi** as the backend data provider and **Next.js** as the frontend application. The core design philosophy is "Config-Driven UI", where the page layout and content structure are defined dynamically in the CMS, and the frontend reacts to this configuration.

## System Components

### 1. Backend (Strapi)
- **Role**: Source of Truth for content, configuration, and user permissions.
- **Key Concepts**:
    - **Single Types / Collection Types**: define schemas for data (e.g., `Page`).
    - **Components**: Reusable data structures (e.g., `Hero`, `CardList`).
    - **Dynamic Zones**: A special field that allows content editors to pick and mix diverse components to build a page layout.
    - **API**: exposing content via REST endpoints (e.g., `/api/pages`).

### 2. Frontend (Next.js)
- **Role**: Fetches data and renders the UI.
- **Key Concepts**:
    - **Client-Side Rendering (CSR)** / **Server-Side Rendering (SSR)** mixed approach.
    - **Dynamic Routing**: `app/[slug]/page.tsx` catches all page requests and fetches corresponding data.
    - **Section Renderer**: A "Switch" component that inspects the data type (e.g., `sections.hero`) and renders the matching React component (`<Hero />`).

## Data Flow
1.  **Request**: User visits `/about`.
2.  **Route**: Next.js matches `app/[slug]/page.tsx`.
3.  **Fetch**: Helper `lib/strapi.ts` calls Strapi API: `GET /api/pages?filters[slug]=about&populate=...`.
4.  **Process**:
    - Response contains a `sections` array (Dynamic Zone).
    - `page.tsx` builds a `UserContext` from URL query params.
    - `SectionRenderer` iterates through `sections`, checking `checkVisibility(rules, context)` for each.
5.  **Render**: Valid sections are rendered to the DOM.

## Visibility Logic
The application implements backend-side visibility filtering.
- **Visibility Rules (Backend Enforced)**:
    - `Page` and `Section` have a `visibilityRules` component.
    - Strapi `api::page.page` controller intercepts requests.
    - Filters out pages/sections based on `region`, `language`, `consent` query params.
    - **Security**: Restricted content is never sent to the client.
