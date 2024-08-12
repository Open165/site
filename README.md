# Open165 Anti-Fraud Information Site

[![CI test](https://github.com/cofacts/open165/actions/workflows/ci.yaml/badge.svg)](https://github.com/cofacts/open165/actions/workflows/ci.yaml)

Open165 Public Information Anti-Fraud Site is built independently by the public to provide resource for individuals who have been targeted by fraud activities.
For more details, please refer to the project proposal: https://g0v.hackmd.io/@mrorz/open165-proposal

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## First-time setup

Setup database using:
```bash
npm i
npm run db:migrate -- --local
npm run db:seed
```

## Start server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

The application is deployed to Cloudflare Pages. The deployment is done automatically when a PR is merged to `main` branch.

If we want to preview the deployment locally, we can use the following command:

```bash
npm run preview
```

This locally builds and previews application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI.

For more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow)

## Updating scam site DB from 165 open data

```bash
# Fetch opendata and update local DB
npm run db:seed

# Fetch opendata and update to remote DB. Add --yes to skip confirmation
npm run db:seed -- --remote
```

## Making changes to the database schema

The project uses Cloudflare D1 database. To make changes to the database schema, follow these steps:

1. Generate new migration SQL file via
    ```bash
    npm run gen:migration -- <migration_name>
    ```
    This will generate a new migration file in `db/migrations` folder, with auto-generated sequence number and `.sql` extension.
2. Modify the migration file as needed.
3. Run the following command to apply migrations:
    ```bash
    # Apply to local DB
    npm run db:migrate -- --local
    # Apply to remote DB (need to login wrangler first)
    npm run db:migrate -- --remote
    ```
4. Update `db/schema.sql` for other devs to see the latest schema.
   ```bash
   npm run gen:schema
   ```

## Incorporating other's changes to the database schema

If you are pulling changes from the repository and the database schema has changed, you need to run the following commands

```bash
# Update local DB by applying new migrations
npm run db:migrate -- --local
```

## Cloudflare Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

After we add or remove bindings from `wrangler.toml`, use the following command to update
Typescript types for `getRequestContext().env`:

```bash
npm run gen:env
```

<detail>
<summary>Details of Cloudflare bindings</summary>
- During development, `setupDevPlatform` from `@cloudflare/next-on-pages` is called to setup bindings for you. This function is called in the `next.config.mjs`.

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).
</detail>
