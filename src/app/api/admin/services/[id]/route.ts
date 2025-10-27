import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise< { id: string }> }
) {
  try {
    const { field, url } = await request.json();
    const params = await context.params;
    const serviceId = params.id;

    if (!field || !url) {
      return NextResponse.json(
        { error: 'Field and URL are required' },
        { status: 400 }
      );
    }

    if (field !== 'image_url') {
      return NextResponse.json(
        { error: 'Invalid field' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE services SET image_url = $1 WHERE id = $2 RETURNING *',
      [url, serviceId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}
