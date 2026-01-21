# Developer Guide

This guide explains how to extend the application with new features.

## Adding a New Section Component

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
