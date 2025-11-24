# Pages Router App - ISR with On-Demand Revalidation

Next.js 15 Pages Router app demonstrating Incremental Static Regeneration (ISR) with manual revalidation. Simulates a production app (e.g., Sitecore-powered) that needs cache control.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local: Set REVALIDATE_SECRET=your-secret-token
npm run build
npm start
```

**Important**: ISR only works in production mode. Must build before starting.

## What's Inside

- **`/demo-page-1`** - ISR page with random color, number, timestamp
- **`/demo-page-2`** - ISR page with random color, number, timestamp  
- **`/api/revalidate`** - POST endpoint for manual cache invalidation

## Environment Variables

Required in `.env.local`:
```
REVALIDATE_SECRET=your-secure-token-here
```

Optional:
```
# Allowed origin for CORS requests to the revalidation API
# Only requests from this origin will be accepted for cross-origin revalidation
# Defaults to https://revalidation-interface-demo.vercel.app if not set
ALLOWED_REVALIDATION_ORIGIN=https://revalidation-interface-demo.vercel.app
```

## API Usage

### POST `/api/revalidate`

```bash
curl -X POST https://your-app.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/demo-page-1", "secret": "your-secret-token"}'
```

**Request**:
```json
{
  "path": "/demo-page-1",
  "secret": "your-secret-token"
}
```

**Response** (200):
```json
{
  "revalidated": true,
  "path": "/demo-page-1"
}
```

**Errors**: `401` Invalid secret | `400` Missing path | `405` Wrong method | `500` Revalidation failed

## How It Works

Pages use `getStaticProps` with `revalidate: false` - no automatic regeneration. Content only updates when you call the revalidation API, giving complete control over when pages refresh.

## Testing Revalidation

**Option 1: With Revalidation Interface**  
Use the companion [Revalidation Interface](https://github.com/your-org/revalidation-interface) - a web UI for triggering revalidation.

**Option 2: Manual cURL**  
Use the curl command above.

**Verify**: Visit a demo page, note the data, trigger revalidation, refresh - data should change.

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   - `REVALIDATE_SECRET=your-production-secret` (required)
   - `ALLOWED_REVALIDATION_ORIGIN=https://your-revalidation-interface.vercel.app` (optional, defaults to `https://revalidation-interface-demo.vercel.app`)
4. Deploy
5. Use your deployed URL in the Revalidation Interface: `https://your-app.vercel.app/api/revalidate`

## Development vs Production

- Development: `npm run dev` (no ISR - hot reload only)
- Production: `npm run build && npm start` (ISR enabled)

## Troubleshooting

**"Cannot read 'revalidate'"**: Running in dev mode. Must use `npm run build && npm start`.

**"Invalid secret"**: Token doesn't match `.env.local`. Check for typos/spaces.

**Page doesn't update**: Hard refresh browser (Cmd/Ctrl + Shift + R) or clear cache.

**CORS errors**: The API endpoint uses origin allowlisting for security. When calling from a cross-origin application (like the Revalidation Interface), ensure the `ALLOWED_REVALIDATION_ORIGIN` environment variable matches the origin of the calling application. Requests from unauthorized origins will be rejected with a 403 error.

## Real-World Use

This pattern works for any CMS triggering Next.js revalidation:
- Sitecore PowerShell scripts
- Contentful webhooks  
- Custom admin interfaces
- CI/CD pipelines

The [Revalidation Interface](https://github.com/your-org/revalidation-interface) provides a user-friendly alternative to command-line tools.
