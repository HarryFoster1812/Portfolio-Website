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
            return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
        }

        const result = await Subscriber.updateOne(
            { confirmationToken: auth_token },
            { $set: { confirmed: true } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { message: 'Token was not updated. It may already be confirmed.' },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: 'Successfully verified!' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Server error. Please try again later.' },
            { status: 500 }
        );

    }
}
