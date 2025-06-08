import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request,
  { params }
) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
      },
    });
  } catch  {
    return new NextResponse('Blog post not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
