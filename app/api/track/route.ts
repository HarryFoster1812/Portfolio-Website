import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { EventModel, IEvent } from '@/lib/event_model';
import crypto from 'crypto';

const SALT = process.env.VID_SALT;


function hostOnly(ref: string): string {
  try {
    const u = new URL(ref, 'https://dummy-base.invalid');
    return u.hostname; 
  } catch {
    return '';
  }
}

function isBot(ua: string) {
  return /(bot|spider|crawl|headless|lighthouse|monitor|pingdom|synthetic)/i.test(ua);
}
function bucketUA(ua: string) {
  const b = /Chrome|Firefox|Safari|Edge|Opera/i.exec(ua)?.[0] || 'Other';
  const os = /Windows|Mac OS|Linux|Android|iPhone|iPad|iOS/i.exec(ua)?.[0]?.replace('Mac OS','macOS') || 'Other';
  return `${b}/${os}`;
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const t0 = Date.now();

  const ua = req.headers.get('user-agent') || '';
  const ref = req.headers.get('referer') || '';
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';
  const cc = req.headers.get('x-vercel-ip-country') || 'ZZ';

  if (isBot(ua)) {
    console.log(`[events][${requestId}] skipped=bot ua="${ua}"`);
    return NextResponse.json({ ok: true, skipped: 'bot' });
  }

  const { path = '/' } = await req.json().catch(() => ({}));
  const client = bucketUA(ua);

  const vid = crypto.createHash('sha1').update(ip + ua + SALT).digest('hex').slice(0, 16);

  const doc: IEvent = {
    path,
    vid,
    cc,
    client,
    ref: hostOnly(ref),
    };

  try {
    const mongo = await connectDB();
    await EventModel.create(doc);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(
      `[events][${requestId}] failure path="${path}" client="${client}" cc="${cc}" err="${e?.message || e}"`
    );

    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
