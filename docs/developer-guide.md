# Developer Guide

This guide explains how to set up the project and extend it with new features.

## 🏁 Getting Started

### 1. Backend Setup (Strapi)

```bash
cd backend
npm install
# Copy .env.example to .env and configure if needed
npm run develop
```

#### API Documentation (Swagger)
Once the backend is running, you can access the **Swagger UI** to test APIs interactively:
- URL: [http://localhost:1337/documentation/v1.0.0](http://localhost:1337/documentation/v1.0.0)
- Configured in: `backend/config/plugins.ts`

#### Database Setup (PostgreSQL)

By default, Strapi uses SQLite. To use PostgreSQL (recommended for production):
1.  Install PostgreSQL and create a database (e.g., `strapi_db`).
2.  Update your `backend/.env` file:
    ```env
    DATABASE_CLIENT=postgres
    DATABASE_HOST=127.0.0.1
    DATABASE_PORT=5432
    DATABASE_NAME=strapi_db
    DATABASE_USERNAME=your_username
    DATABASE_PASSWORD=your_password
    ```
3.  Re-run `npm run develop`. Strapi will automatically create tables.

### 2. Middleware Setup (NestJS)

```bash
cd nest_backend
npm install
npm run start:dev
```

#### API Documentation (Swagger)
The NestJS proxy exposes a Swagger UI for API documentation and testing:
- URL: [http://localhost:3001/api](http://localhost:3001/api)


### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
# Copy .env.local.example (if exists) or create one
npm run dev
```

For a stable development experience avoiding Turbopack issues:
```bash
npm run dev:webpack
```

## 🌍 Internationalization (i18n)

This project supports **English (en)** and **Spanish (es)**.

### Architecture
- **Backend**: Content is localized in Strapi. Each entry (Page) has a locale.
- **Frontend**:
    - Uses **Dynamic Routing** via `app/[lang]/`.
    - `app/page.tsx` detects the user's browser language (`Accept-Language` header) and redirects to `/en` or `/es`.
    - **Links**: `Navbar`, `CardList`, and `LinkSection` automatically prepend the current locale (e.g., `/es/about`) to internal links.

### Adding a New Language
1.  **Strapi**: Go to *Settings > Internationalization* and add the new locale (e.g., French `fr`).
2.  **Frontend**: Update `frontend/app/page.tsx` detection logic if specific handling is needed, otherwise the routing `app/[lang]` handles it automatically.

### Adding Localized Content
1.  Create a Page in the default locale (English).
2.  In the Content Manager, select the new locale from the dropdown.
3.  Click "Fill in from another I18n locale" (optional) and Translate.
4.  **Important**: Ensure slugs are unique or localized (e.g. `about` -> `a-propos`).

## 🧩 Adding a New Section Component

To add a new UI section (e.g., a "Testimonial" slider), you need to touch both Backend and Frontend.

### Step 1: Backend (Strapi)
1.  Go to **Content-Type Builder**.
2.  Select **Components** > **Create new component**.
3.  **Name**: `Testimonial`, **Category**: `sections`.
4.  **Attributes**: Add fields (e.g., `Quote` (Text), `Author` (Text), `Rating` (Number)).
5.  **Crucial**: Add an existing component `shared.visibility-rules` with name `visibilityRules`.
6.  **Save**.
7.  Go to **Collection Types** > **Page**.
8.  Click on the `sections` Dynamic Zone field.
9.  Click "Add components to the zone" and select your new `sections.testimonial`.
10. **Save**.

### Step 2: Frontend (Next.js)
1.  **Type Definition**:
    - Open `frontend/lib/strapi.ts`.
    - Define your interface:
    ```typescript
    export interface TestimonialSection extends BaseSection {
        __component: 'sections.testimonial';
        quote: string;
        author: string;
    }
    ```
    - **Crucial**: Add `TestimonialSection` to the `Section` union type:
    ```typescript
    export type Section = HeroSection | CardListSection | LinkSection | TestimonialSection;
    ```

2.  **Create Component**:
    - Create `frontend/components/sections/Testimonial.tsx`.
    - Implement the UI using the type:
    ```tsx
    import { TestimonialSection } from '../../lib/strapi';
    export function Testimonial(props: TestimonialSection) { ... }
    ```

3.  **Register Component**:
    - Open `frontend/components/SectionRenderer.tsx`.
    - Import your new component.
    - Add a `case` to the switch statement:
    ```tsx
    case 'sections.testimonial':
        return <Testimonial key={`${section.__component}-${index}`} {...section} />;
    ```

### Step 3: Verify
- Restart Next.js dev server.
- Add the new component to a page in Strapi.
- Check if it renders at `http://localhost:3000`.
