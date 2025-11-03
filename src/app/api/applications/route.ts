import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/applications
 * Fetch applications with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const company = searchParams.get('company')
    const resumeVersion = searchParams.get('resumeVersion')

    const applications = await prisma.application.findMany({
      where: {
        ...(status && { status }),
        ...(source && { source }),
        ...(company && { company: { contains: company } }),
        ...(resumeVersion && { resumeVersion }),
      },
      orderBy: { dateApplied: 'desc' },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/applications
 * Create a new application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const application = await prisma.application.create({
      data: {
        company: body.company,
        jobTitle: body.jobTitle,
        url: body.url,
        resumeVersion: body.resumeVersion,
        status: body.status || 'Applied',
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        notes: body.notes,
        source: body.source,
        dateApplied: body.dateApplied ? new Date(body.dateApplied) : new Date(),
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
