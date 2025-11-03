import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/reviews
 * Fetch weekly reviews
 */
export async function GET(request: NextRequest) {
  try {
    const reviews = await prisma.weeklyReview.findMany({
      orderBy: { weekOf: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching weekly reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly reviews' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews
 * Create or update a weekly review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const review = await prisma.weeklyReview.upsert({
      where: { weekOf: new Date(body.weekOf) },
      update: {
        jobApplications: body.jobApplications || 0,
        deepWorkHours: body.deepWorkHours || 0,
        revenueThisWeek: body.revenueThisWeek || 0,
        contentPosted: body.contentPosted || 0,
        networkOutreach: body.networkOutreach || 0,
        meetingsNotes: body.meetingsNotes,
        blockers: body.blockers,
        wins: body.wins,
        actionItems: body.actionItems,
      },
      create: {
        weekOf: new Date(body.weekOf),
        jobApplications: body.jobApplications || 0,
        deepWorkHours: body.deepWorkHours || 0,
        revenueThisWeek: body.revenueThisWeek || 0,
        contentPosted: body.contentPosted || 0,
        networkOutreach: body.networkOutreach || 0,
        meetingsNotes: body.meetingsNotes,
        blockers: body.blockers,
        wins: body.wins,
        actionItems: body.actionItems,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating weekly review:', error)
    return NextResponse.json(
      { error: 'Failed to create weekly review' },
      { status: 500 }
    )
  }
}
