import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/network
 * Fetch network contacts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const outcome = searchParams.get('outcome')
    const responded = searchParams.get('responded')

    const contacts = await prisma.networkContact.findMany({
      where: {
        ...(outcome && { outcome }),
        ...(responded !== null && { responded: responded === 'true' }),
      },
      orderBy: { dateContacted: 'desc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching network contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network contacts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/network
 * Create a new network contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const contact = await prisma.networkContact.create({
      data: {
        contactName: body.contactName,
        company: body.company,
        method: body.method,
        purpose: body.purpose,
        responded: body.responded || false,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        outcome: body.outcome,
        notes: body.notes,
        dateContacted: body.dateContacted ? new Date(body.dateContacted) : new Date(),
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating network contact:', error)
    return NextResponse.json(
      { error: 'Failed to create network contact' },
      { status: 500 }
    )
  }
}
