// app/[code]/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../lib/db';
import { isValidCode } from '../../lib/validators';

export async function GET(req, { params }) {
  const code = params.code;
  
  if (!isValidCode(code)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const res = await client.query(
      'SELECT target FROM links WHERE code = $1 FOR UPDATE',
      [code]
    );

    if (res.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    const target = res.rows[0].target;

    await client.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code = $1',
      [code]
    );

    await client.query('COMMIT');

    return NextResponse.redirect(target, 302);

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('redirect error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
