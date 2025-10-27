// src/app/api/contact/route.ts
import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

// Initialize Mailjet client
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save to database
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [name, email, phone, subject, message, ipAddress, userAgent]
    );

    // Send email using Mailjet
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL,
            Name: process.env.MAILJET_FROM_NAME || 'Bhawani Construction',
          },
          To: [
            {
              Email: 'mukundkumarpathak850@gmail.com',
              Name: 'Admin',
            },
          ],
          Subject: `New Contact Form: ${subject}`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background: #fff; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p style="margin: 0; color: #666;"><strong>Message:</strong></p>
                <p style="margin: 10px 0; line-height: 1.6; color: #333;">
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <div style="color: #9ca3af; font-size: 12px;">
                <p><strong>Submitted at:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                <p><strong>IP Address:</strong> ${ipAddress}</p>
                <p><strong>User Agent:</strong> ${userAgent}</p>
                <p><strong>Message ID:</strong> #${result.rows[0].id}</p>
              </div>
            </div>
          `,
        },
      ],
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully', 
        id: result.rows[0].id 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Contact form error:', error);

    // Type guard for Mailjet-like errors
    function isMailjetError(e: unknown): e is { statusCode?: number; message?: string } {
      return typeof e === 'object' && e !== null && 'statusCode' in e;
    }

    // Log Mailjet specific errors
    if (isMailjetError(error) && error.statusCode) {
      console.error('Mailjet Error:', error.statusCode, error.message);
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
