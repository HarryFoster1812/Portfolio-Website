import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose'; 
import {Subscriber} from '@/lib/subscriber_model'

export async function POST(
    request: NextRequest,
) {
    const { auth_token } = await request.json();
    try{
        await connectDB();
        const existing = await Subscriber.findOne({confirmationToken: auth_token });
        if(!existing){
            return NextResponse.json({ message: 'Could not find user' }, { status: 400 });
        }

        const result = await Subscriber.deleteOne(
            { confirmationToken: auth_token },
        );

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'User was not removed. Please try again later.' },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: 'Successfully unsubscribed!' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Server error. Please try again later.' },
            { status: 500 }
        );

    }
}
