import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Upload the image to a storage service (e.g., S3)
    // 2. Get the URL of the uploaded image
    // 3. Store the URL in the database
    // For this example, we'll simulate it:
    const imageUrl = '/mock-image-url.jpg';

    const message = await prisma.message.create({
      data: {
        content: imageUrl,
        userId: session.user.id,
        isImage: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Emit the message through Socket.IO
    const io = (global as any).io;
    if (io) {
      io.emit('message', message);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}