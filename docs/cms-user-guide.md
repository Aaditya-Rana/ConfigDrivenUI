# CMS User Guide

This guide explains how to manage content in Strapi for the Config-Driven UI.

## Login
Access the Admin Panel at: `http://localhost:1337/admin`

## Managing Pages
1.  Go to **Content Manager** > **Page**.
2.  **Create New Entry** or click on an existing page (e.g., `home`).
3.  **Title & Slug**: define the page name and URL path (e.g., `about-us` becomes `/about-us`).

### Dynamic Zones (Sections)
The **Sections** field is a Dynamic Zone. You can add components here in any order.
- **Click "+"**: Choose a component to add.
    - **Hero**: Large banner with text and button.
    - **Card List**: Grid of informational cards.
    - **Link Section**: Standalone links.
- **Reorder**: Drag and drop components to change their display order.

### 2. Visibility Rules
Most components (and the Page itself) have a `Visibility Rules` tab/component.
- **Enabled**: Toggle to show/hide.
- **Requires Consent**: If ON, user must have given consent (passed via `?consent=true`).
- **Regions**: List of allowed country codes (e.g., `US`, `CA`).
- **Scheduling**:
    - **Start Time**: Date/Time when this content should start appearing.
    - **End Time**: Date/Time when this content should stop appearing.

> **Note**: Language-based visibility is now handled natively by Strapi's Internationalization (i18n) feature (using the Locale dropdown). These rules are enforced by the **Backend API**.
- **Languages**: Click "+" to add language codes (e.g., `en`, `es`). Leave empty to show to ALL languages.

## Testing Your Content
Since visibility rules logic happens in the frontend, you can test different scenarios by modifying the URL in your browser:
- **Default View**: `http://localhost:3000/your-page-slug`
- **Simulate Region**: `http://localhost:3000/your-page-slug?region=US`
- **Simulate Consent**: `http://localhost:3000/your-page-slug?consent=true`
