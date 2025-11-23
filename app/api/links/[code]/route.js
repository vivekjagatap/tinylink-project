// app/api/links/[code]/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import { isValidCode } from '../../../../lib/validators';

export async function GET(req, { params }) {
  const code = params.code;
  if (!isValidCode(code)) {
    return NextResponse.json({ error: 'invalid code' }, { status: 400 });
  }
  const res = await pool.query('SELECT code, target, clicks, last_clicked, created_at FROM links WHERE code = $1', [code]);
  if (res.rowCount === 0) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function DELETE(req, { params }) {
  const code = params.code;
  if (!isValidCode(code)) {
    return NextResponse.json({ error: 'invalid code' }, { status: 400 });
  }
  const res = await pool.query('DELETE FROM links WHERE code = $1 RETURNING code', [code]);
  if (res.rowCount === 0) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
