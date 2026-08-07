// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { groq } from 'next-sanity';

// Initialize Sanity client with write permissions
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Simple in-memory rate limiting (for development)
// In production, use Redis or a database
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5; // 5 submissions per hour

  const record = rateLimit.get(ip);
  
  if (!record) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Email notification function (using a service like Resend, SendGrid, etc.)
async function sendEmailNotification(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    // Option 1: Using Resend
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.emails.send({
    //   from: 'contact@fundgrube-bestpreis.de',
    //   to: 'info@fundgrube-bestpreis.de',
    //   subject: `Neue Kontaktanfrage: ${data.subject}`,
    //   html: `
    //     <h2>Neue Kontaktanfrage</h2>
    //     <p><strong>Name:</strong> ${data.name}</p>
    //     <p><strong>Email:</strong> ${data.email}</p>
    //     <p><strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</p>
    //     <p><strong>Betreff:</strong> ${data.subject}</p>
    //     <p><strong>Nachricht:</strong></p>
    //     <p>${data.message}</p>
    //   `,
    // });

    // Option 2: Using nodemailer (SMTP)
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    // 
    // await transporter.sendMail({
    //   from: `"Fundgrube Contact" <${process.env.SMTP_FROM}>`,
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `Neue Kontaktanfrage: ${data.subject}`,
    //   html: `...`,
    // });

    console.log('Email notification would be sent here');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

// Send auto-reply to user
async function sendAutoReply(email: string, name: string) {
  try {
    // Send auto-reply email
    // await resend.emails.send({
    //   from: 'contact@fundgrube-bestpreis.de',
    //   to: email,
    //   subject: 'Ihre Anfrage bei Fundgrube Bestpreis',
    //   html: `
    //     <h2>Vielen Dank für Ihre Anfrage!</h2>
    //     <p>Liebe/r ${name},</p>
    //     <p>Wir haben Ihre Nachricht erhalten und werden uns in Kürze bei Ihnen melden.</p>
    //     <p>Mit freundlichen Grüßen,<br/>Ihr Fundgrube Bestpreis Team</p>
    //   `,
    // });
    
    console.log('Auto-reply would be sent to:', email);
    return true;
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!name || name.trim().length < 2) {
      errors.name = 'Name muss mindestens 2 Zeichen lang sein';
    }
    
    if (!email) {
      errors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    if (!subject || subject.trim().length === 0) {
      errors.subject = 'Betreff ist erforderlich';
    }
    
    if (!message || message.trim().length < 10) {
      errors.message = 'Nachricht muss mindestens 10 Zeichen lang sein';
    } else if (message.length > 1000) {
      errors.message = 'Nachricht darf 1000 Zeichen nicht überschreiten';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors,
          message: 'Bitte korrigieren Sie die markierten Felder.'
        },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
               
    if (!checkRateLimit(ip as string)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.',
          rateLimited: true
        },
        { status: 429 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Sanitize input
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
    };

    // Create submission in Sanity
    const submission = await sanityClient.create({
      _type: 'contactSubmission',
      ...sanitizedData,
      status: 'new',
      submittedAt: new Date().toISOString(),
      ipAddress: ip as string,
      userAgent,
    });

    // Send email notifications (in background, don't wait)
    try {
      await Promise.all([
        sendEmailNotification(sanitizedData),
        sendAutoReply(sanitizedData.email, sanitizedData.name)
      ]);
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Email notification error:', emailError);
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.',
        submissionId: submission._id,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    // Handle Sanity-specific errors
    if (error instanceof Error) {
      if (error.message.includes('permission')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Server-Konfigurationsfehler. Bitte kontaktieren Sie den Support.',
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json(
    { 
      status: 'OK', 
      message: 'Contact API is running. Use POST to submit forms.',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}