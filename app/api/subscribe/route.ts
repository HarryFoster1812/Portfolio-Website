import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose'; 
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/subscribe_email'; 
import {Subscriber} from '@/lib/subscriber_model'

function validateEmail(email: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email || !validateEmail(email)) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'Email already subscribed' }, { status: 409 });
        }

        const confirmationToken = uuidv4();

        const subscriber = new Subscriber({ email, confirmationToken });
        await subscriber.save();

        await sendVerificationEmail({ email, confirmationToken });

        console.log(`Confirmation email sent to ${email} with token: ${confirmationToken}`);

    return NextResponse.json(
      { message: 'Subscription successful. Please check your email to confirm.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
