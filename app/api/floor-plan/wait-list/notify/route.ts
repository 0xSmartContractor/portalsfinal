import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partyId } = await request.json();

    const party = await prisma.waitingParty.findUnique({
      where: { id: partyId },
    });

    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    // Send SMS notification
    await client.messages.create({
      body: `Your table is almost ready! Please return to the host stand.`,
      to: party.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    // Update notification status
    await prisma.waitingParty.update({
      where: { id: partyId },
      data: {
        notified: true,
        lastNotified: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}