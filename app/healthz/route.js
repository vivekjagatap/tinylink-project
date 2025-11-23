// app/healthz/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: process.env.APP_VERSION || '1.0.0'
  });
}
