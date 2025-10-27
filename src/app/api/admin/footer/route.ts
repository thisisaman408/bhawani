import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Field and value are required' },
        { status: 400 }
      );
    }

    const validFields = ['company_tagline', 'copyright_text'];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: 'Invalid field' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE footer_content SET ${field} = $1, updated_at = NOW() WHERE active = true RETURNING *`,
      [value]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No active footer content found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating footer:', error);
    return NextResponse.json(
      { error: 'Failed to update footer content' },
      { status: 500 }
    );
  }
}
