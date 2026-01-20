import type { NextApiRequest, NextApiResponse } from 'next';

interface RevalidateRequest {
  path?: string;
  secret?: string;
  // siteName?: string; // Optional site name for multisite paths
}

interface RevalidateResponse {
  revalidated: boolean;
  path?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>
) {
  // Get allowed origin from environment variable or use default
  const allowedOrigin = process.env.ALLOWED_REVALIDATION_ORIGIN || 'https://revalidation-interface-demo.vercel.app';
  const requestOrigin = req.headers.origin;

  // Set CORS headers at the very start, before any method checks
  // Only set CORS headers for cross-origin requests
  if (requestOrigin) {
    // Validate origin for cross-origin requests
    if (requestOrigin !== allowedOrigin) {
      return res.status(403).json({ 
        revalidated: false, 
        error: 'Origin not allowed' 
      });
    }
    
    // Set CORS headers for allowed origin
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  // Same-origin requests (no origin header) are allowed without CORS headers

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ revalidated: false, error: 'Method not allowed' });
  }

  const { path, secret } = req.body as RevalidateRequest;

  // Validate secret
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    console.error('Revalidation failed: Invalid or missing secret');
    return res.status(401).json({ revalidated: false, error: 'Invalid secret' });
  }

  // Validate path
  if (!path || path.trim() === '') {
    return res.status(400).json({ revalidated: false, error: 'Path is required' });
  }

  try {
    console.log(`Revalidating path: ${path}`);
    
    // Trigger on-demand ISR revalidation
    await res.revalidate(path);
    
    console.log(`Successfully revalidated: ${path}`);
    return res.json({ revalidated: true, path });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({
      revalidated: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

