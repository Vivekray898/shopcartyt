// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Initialize Sanity client with write permissions
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_API_TOKEN, // You need to add this to your .env.local
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create submission in Sanity
    const submission = await sanityClient.create({
      _type: 'contactSubmission',
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new',
      submittedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        submissionId: submission._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}