# Strapi v5 Setup Guide

This project is built using **Strapi v5**. This guide outlines the steps to set up and run the backend locally.

## Prerequisites
- **Node.js**: v18.0.0 or later (v20 LTS recommended).
- **npm** or **yarn**: Package manager.
- **Database**: SQLite (default for development), or PostgreSQL/MySQL for production.

## Installation

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    - Strapi comes with a default configuration.
    - If needed, create a `.env` file in the `backend` root. You can copy `.env.example` if it exists, or just use defaults for development.
    - Key variables often include:
        - `HOST`: 0.0.0.0
        - `PORT`: 1337
        - `APP_KEYS`: Generated automatically or set manually.
        - `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`.

## Running the Project

### Development Mode
To start the server with auto-reload enabled (best for development):

```bash
npm run develop
# or
yarn develop
```

- **Admin Panel**: [http://localhost:1337/admin](http://localhost:1337/admin)
- **API Endpoint**: [http://localhost:1337/api](http://localhost:1337/api)

### Production Build
To build and start for production:

```bash
npm run build
npm run start
```

## Strapi v5 Specifics

### Content API
Strapi v5 introduces changes to the Content API response structure.
- **Document Service**: Used internally for data manipulation.
- **REST API**: Returns data in a `data` object.

### TypesScript
This project is configured with TypeScript.
- **Schemas**: Located in `src/api/[api-name]/content-types/[content-type]/schema.json`.
- **Types**: Generated types are in `types/generated/`.

### Configuration
- **Database**: `config/database.ts`
- **Server**: `config/server.ts`
- **Admin**: `config/admin.ts`

## Troubleshooting

- **Port in use**: If port 1337 is taken, check `config/server.ts` or `.env` to change it, or kill the process using the port.
- **Dependency issues**: Try deleting `node_modules` and `package-lock.json` and running `npm install` again.
