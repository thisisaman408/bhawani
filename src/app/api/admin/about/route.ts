import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const { field, url } = await request.json();

    if (!field || !url) {
      return NextResponse.json(
        { error: 'Field and URL are required' },
        { status: 400 }
      );
    }

    const validFields = [
      'hero_image_url',
      'secondary_image_url',
      'accent_image_1_url',
      'accent_image_2_url',
    ];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: 'Invalid field' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE about_us_content SET ${field} = $1, updated_at = NOW() WHERE active = true RETURNING *`,
      [url]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No active about content found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}
