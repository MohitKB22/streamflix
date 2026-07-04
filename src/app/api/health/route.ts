import { NextResponse } from 'next/server';

// Proof-of-life for the API layer conventions (Phase 4 builds the real
// REST surface under src/app/api/**). Hitting GET /api/health should
// return 200 the moment `npm run dev` is up, before any DB, auth, or
// third-party service is configured.
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
