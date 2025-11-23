// app/api/links/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { customAlphabet } from 'nanoid';
import { isValidUrl } from '../../../lib/validators';

const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(ALNUM, 6);

export async function GET() {
  const res = await pool.query('SELECT code, target, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC');
  return NextResponse.json(res.rows);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const target = body?.target;
  let code = body?.code;

  if (!target) return NextResponse.json({ error: 'target required' }, { status: 400 });
  if (!isValidUrl(target)) return NextResponse.json({ error: 'invalid target URL' }, { status: 400 });

  if (code) {
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return NextResponse.json({ error: 'code must match [A-Za-z0-9]{6,8}' }, { status: 400 });
    }
  } else {
    // generate a code; ensure it's alphanumeric and 6 chars
    code = nanoid();
  }

  try {
    const insert = await pool.query(
      'INSERT INTO links (code, target) VALUES ($1, $2) RETURNING code, target, clicks, last_clicked, created_at',
      [code, target]
    );
    return NextResponse.json(insert.rows[0], { status: 201 });
  } catch (err) {
    // unique violation code for Postgres is 23505
    if (err && err.code === '23505') {
      return NextResponse.json({ error: 'code already exists' }, { status: 409 });
    }
    console.error('POST /api/links error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
