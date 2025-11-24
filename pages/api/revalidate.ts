import type { NextApiRequest, NextApiResponse } from 'next';

interface RevalidateRequest {
  path?: string;
  secret?: string;
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
  // Enable CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

