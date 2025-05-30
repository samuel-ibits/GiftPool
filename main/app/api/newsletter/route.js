import { NextResponse } from 'next/server';
import Newsletter from '@/models/newsletter';
import { connectToDatabase } from '@/lib/mongoose';
import { sendNewsletterMail } from '@/utils/mailer';


export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Simulate adding the email to a newsletter list 
        await connectToDatabase();
        const existingEmail = await Newsletter.findOne({ email });
        if (existingEmail) {
            await Newsletter.updateOne({ email }, { unsubscribed: false });
            await sendNewsletterMail({to:email});
            return NextResponse.json({ message: 'Successfully resubscribed to the newsletter!' });
        }
       

        await Newsletter.create({ email });
        await sendNewsletterMail({to:email});

        return NextResponse.json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}