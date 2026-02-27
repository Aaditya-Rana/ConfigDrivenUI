# Journey Visualizer Plugin

The **Journey Visualizer** is a custom Strapi v5 plugin built with TypeScript that provides an interactive, visual representation of your configured Journeys. It renders the `Screen` flows and `Transition` logic as a dynamic node-based graph directly within the Strapi Admin Control Panel.

---

## 🚀 Getting Started

### Prerequisites
- The Strapi Backend must be running (`yarn develop` inside the `backend/` directory).
- You must have at least one Journey configured in the **Content Manager** (`Journey` Collection Type) with a valid `startScreen` and associated Transitions.

### Accessing the Visualizer
1. Log in to the Strapi Admin Panel ([http://localhost:1337/admin](http://localhost:1337/admin)).
2. Look for **Journey Visualizer** in the left-hand navigation menu under the **Plugins** category.
3. Select a Journey from the dropdown menu to load its graph.

---

## 🏗️ Technical Architecture

This plugin is divided into two parts characteristic of Strapi plugins: the **Server** (backend APIs) and the **Admin** (frontend React UI).

### Server (Backend)
Located in `backend/src/plugins/journey-visualizer/server/`.

- **Services (`service.ts`)**: 
  - `findAllJourneys()`: Queries the `api::journey.journey` content type to list all available journeys.
  - `getJourneyGraph(slug)`: The core logic engine. It fetches a journey by its unique slug, identifies its starting screen, and uses a **Breadth-First Search (BFS)** algorithm to traverse all connected screens via their `transitions`. It formats this data into `nodes` (screens) and `edges` (connections) required by the frontend graph.
- **Controllers (`controller.ts`)**: Exposes the service functions as endpoints.
- **Routes (`routes/admin/index.ts`)**: Binds the `/journeys` and `/graph/:slug` endpoints strictly to authenticated Strapi Admin users.

### Admin (Frontend)
Located in `backend/src/plugins/journey-visualizer/admin/`.

- **Framework**: Built with React and integrated natively into the Strapi v5 Admin interface using Vite.
- **Graphing Engine (`@xyflow/react`)**: We use React Flow to render the interactive canvas.
- **Custom Layout Algorithm**: Instead of relying on heavy third-party auto-layout engines (like `@dagrejs/dagre`, which cause bundling issues), the plugin implements a lightweight, custom BFS-based hierarchical tree layout in `JourneyGraph.tsx` (`getLayoutedElements`). It calculates absolute X and Y positioning for nodes to ensure a clean, top-down visual hierarchy.

---

## 🛠️ Developer Guide: Modifying the Plugin

If you wish to make changes to the visualizer (e.g., adding new colors based on transition rules, or adding custom node templates), follow these steps:

### 1. Running in Development Mode
To actively develop the plugin and watch for changes:
1. Open a terminal in the plugin folder:
   ```bash
   cd backend/src/plugins/journey-visualizer
   ```
2. Run the watch script:
   ```bash
   yarn watch
   ```
3. In a separate terminal, run the Strapi backend:
   ```bash
   cd backend
   yarn develop
   ```

### 2. Common Modifications

**Changing Node Styling**
To change how the screens visually look in the tree, modify the React Flow styles in `backend/src/plugins/journey-visualizer/admin/src/components/JourneyGraph.tsx`. Nodes accept standard CSS properties, and their colors are currently derived from their `screenType` block.

**Updating the Graph Data Structure**
If you add new fields to the `Screen` or `Transition` components in Strapi and want them reflected in the graph (e.g., showing transition logic operators on the edges), update the BFS traversal generator located in:
`backend/src/plugins/journey-visualizer/server/src/services/service.ts`.

### 3. Rebuilding for Production
If you make changes to the `admin/` source folder and are not using `yarn watch`, you **must** recompile the plugin before Strapi can serve the updated UI.

```bash
cd backend/src/plugins/journey-visualizer
yarn build
```
*(Note: If the build encounters memory ceilings, run `NODE_OPTIONS='--max-old-space-size=4096' yarn build`)*.

---

## 🏗️ Creating a New TypeScript Plugin from Scratch

If you want to create a brand new Strapi v5 plugin with TypeScript in another project, you can use the official Strapi SDK command. This is exactly how the `journey-visualizer` was scaffolded.

### 1. Generate the Plugin Boilerplate

Navigate to the `src/plugins` directory of your Strapi backend project (create the folder if it doesn't exist):
```bash
cd backend
mkdir -p src/plugins
cd src/plugins
```

Run the plugin initialization command:
```bash
npx @strapi/sdk-plugin@latest init <your-plugin-name>
```

When prompted, you can provide details like the plugin name, description, and author. **Crucially, when asked if you want to use TypeScript, select `yes`.** This will generate a fully configured TypeScript plugin boilerplate inside the `src/plugins/<your-plugin-name>` directory.

### 2. Enable the Plugin

Once the boilerplate is created, you must explicitly enable the plugin in your Strapi project's configuration.

Open (or create) `backend/config/plugins.ts` and add your plugin to the exported configuration object:

```typescript
export default {
  // ... other plugins
  'your-plugin-name': {
    enabled: true,
    resolve: './src/plugins/your-plugin-name',
  },
};
```

### 3. Build the Plugin

Before Strapi can serve the plugin's Admin UI, the React frontend code must be bundled using Vite via the plugin CLI tool.

Navigate into your new plugin's directory and run the build command:
```bash
cd <your-plugin-name>
yarn install
yarn build
```

*(Note: If the `yarn build` command throws a JavaScript heap out of memory error, you can fix it by temporarily raising Node's memory limit: `NODE_OPTIONS='--max-old-space-size=4096' yarn build`)*.

### 4. Run the Backend

Finally, return to your main `backend/` directory and start Strapi:
```bash
cd ../../.. # Navigate back to the backend/ root directory
yarn develop
```

Your new plugin will now appear in the Strapi Admin Control Panel sidebar, and you can begin developing its custom backend APIs and frontend React components!
