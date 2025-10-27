import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params:Promise < { id: string }> }
) {
  try {
    const { field, value } = await request.json();
    const params = await context.params;
    const socialId = params.id;

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Field and value are required' },
        { status: 400 }
      );
    }

    if (field !== 'url') {
      return NextResponse.json(
        { error: 'Invalid field. Only "url" can be updated.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE social_links SET url = $1 WHERE id = $2 RETURNING *',
      [value, socialId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Social link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating social link:', error);
    return NextResponse.json(
      { error: 'Failed to update social link' },
      { status: 500 }
    );
  }
}
