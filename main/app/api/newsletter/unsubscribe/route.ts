import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Newsletter from '@/lib/models/Newsletter';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }
        // Simulate removing the email from the newsletter list
        await connectToDatabase();      
        const result = await Newsletter.updateOne({ email }, { $set: { unsubscribe: true } });
         console.log(`Unsubscribing email: ${result }`);
        if (result.matchedCount === 0) {
          throw new Error("Email not found.");
        }

        if (result) {
            return NextResponse.json({ message: 'Successfully unsubscribed' });
        } else {
            return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error'+error }, { status: 500 });
    }
}

// Mock function to simulate email unsubscription
async function unsubscribeEmail(email) {
    await connectToDatabase();      
    const result = await Newsletter.updateOne({ email }, { $set: { unsubscribe: true } });
console.log(`Unsubscribing email: ${result }`);
    if (result.matchedCount === 0) {
      throw new Error("Email not found.");
    }
        console.log(`Unsubscribing email: ${email}`);
    return true;
}