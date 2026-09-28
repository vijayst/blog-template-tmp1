# Firebase to Vercel Migration Guide

## Changes Made

### 1. GitHub Workflow ([.github/workflows/deploy.yaml](.github/workflows/deploy.yaml))
- **Removed**: Firebase-specific inputs and deployment steps
- **Added**: `vercel pull` to fetch project settings
- **Added**: `vercel build` to build locally with generated files
- **Added**: `--prebuilt` flag to deploy prebuilt artifacts
- **Changed**: Runner from `macos-latest` to `ubuntu-latest` (cost optimization)
- **Inputs**:
  - `pat`: ChatBlogr API token (used during local build)
  - `site_name`: Site name (for local manifest generation)
  - `image_url`: Base image URL for social media (for local image generation)
  - `environment`: Deployment environment (production or preview)
  - `vercel_org_id`: Vercel Organization ID
  - `vercel_project_id`: Vercel Project ID
  - `vercel_token`: Vercel authentication token

### 2. Deployment Scripts ([package.json](package.json))
- **Changed**: `deploy` script to use Vercel deployment

### 3. Configuration Files
- **Created**: [vercel.json](vercel.json) - Vercel configuration with trailing slash and clean URLs
- **Removed**: [firebase.json](firebase.json) - No longer needed (can be deleted)
- **Created**: [.env.example](.env.example) - Environment variables template

### 4. Next.js Config ([next.config.ts](next.config.ts))
- **Removed**: `output: "export"` for dynamic deployment

## Setup Requirements

### 1. Install Vercel CLI Locally
```bash
npm install
```
The Vercel CLI will be automatically downloaded when using `npx vercel` commands.

### 2. Get Your Vercel Credentials
Create a Vercel project at [vercel.com/new](https://vercel.com/new), then find your credentials:
- In your Vercel project dashboard → Settings → General
- Copy the **Project ID**
- For **Organization ID**: Check your browser URL when viewing the project, or use Vercel CLI: `npx vercel teams ls`

### 3. Configure Workflow
Generate a Vercel token at [vercel.com/account/tokens](https://vercel.com/account/tokens):
- Click "Create Token"
- Give it a name (e.g., "GitHub Actions Deploy")
- Copy the token - you'll provide it as a workflow input

### 4. Configure Workflow
When running the workflow, provide the following:
- `pat`: Your ChatBlogr API token (required) - passed as build environment variable
- `site_name`: Your site name
- `image_url`: Base image URL for social media
- `environment`: `production` or `preview` (default: production)
- `vercel_org_id`: Your Vercel organization ID (required)
- `vercel_project_id`: Your Vercel project ID (required)
- `vercel_token`: Your Vercel token (required)

**Note**: `CHATBLOGR_PAT` is passed via the `--build-env` flag during deployment, so Vercel can access it during the build process.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Deploy to Vercel (production)
npm run deploy
```

## Cleanup (Optional)

Remove Firebase-related files:
```bash
rm firebase.json
rm -rf .firebase
```

Remove firebase-tools from dependencies:
```bash
npm uninstall firebase-tools
```

## Benefits of Vercel

- **Faster deployments**: Optimized for Next.js
- **Automatic previews**: PRs get instant preview URLs
- **Edge functions**: Deploy to edge locations globally
- **Better analytics**: Built-in analytics dashboard
- **Zero-config**: Works out of the box with Next.js

## Notes

- The Next.js config now uses dynamic deployment (removed `output: "export"`)
- Trailing slash behavior is maintained via vercel.json
- All existing functionality remains the same
- The workflow builds locally with `vercel build`, then deploys with `--prebuilt` flag
- You don't need to run `vercel link` locally - just provide the IDs as workflow inputs
- Dynamic deployment is better for Next.js apps with dynamic routes like `[id]`
- `CHATBLOGR_PAT` is used during local build to fetch data
- Generated images and manifest are built locally and included in the deployment
- The build environment must match the deployment environment (production/preview)