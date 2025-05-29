import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Contact } from '@/models/contact';
import { sendContactMail } from '@/utils/mailer';

export async function POST(request) {
  const { name, email, message, source = 'other' } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Save contact with source info
    await Contact.create({ name, email, message, source });

    // Send email
    const emailResult = await sendContactMail({ to: email, name, message });

    return NextResponse.json({
      message: 'Success! Message received and email sent.',
      status: 200,
      data: emailResult,
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      message: 'Internal Server Error',
      status: 500,
      error: error.message,
    });
  }
}
