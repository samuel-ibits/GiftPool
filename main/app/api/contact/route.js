import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Contact } from '@/models/contact';
import Newsletter from '@/models/newsletter';
import { sendContactMail,sendNewsletterMail } from '@/utils/mailer';
import { SERVER_PROPS_EXPORT_ERROR } from 'next/dist/lib/constants';

export async function POST(request) {
  const { name, email, message, source = 'other',subject, phonenumber, newsletter } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try { 
    await connectToDatabase();

    // Save contact with source info
    await Contact.create({ name, email, message, source,subject, phonenumber });

    // Send email
    const emailResult = await sendContactMail({ to: email, name, message:subject });
    if (newsletter) {
      // Add email to newsletter list
      await Newsletter.create(
        { email }
      );
      await sendNewsletterMail({ to: email, name });
    }

    return created(emailResult);
  } catch (error) {
    console.error('❌ Error:', error);
    return serverError('Internal Server Error');
  }
}
