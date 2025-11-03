import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/revenue
 * Fetch revenue weeks
 */
export async function GET(request: NextRequest) {
  try {
    const weeks = await prisma.revenueWeek.findMany({
      orderBy: { weekOf: 'desc' },
    })

    return NextResponse.json(weeks)
  } catch (error) {
    console.error('Error fetching revenue weeks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue weeks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/revenue
 * Create or update a revenue week
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const weeklyTotal =
      (body.tylerRevenue || 0) +
      (body.clientRevenue || 0) +
      (body.templateSalesAmount || 0) +
      (body.otherIncome || 0)

    const week = await prisma.revenueWeek.upsert({
      where: { weekOf: new Date(body.weekOf) },
      update: {
        tylerWorkHours: body.tylerWorkHours || 0,
        tylerRevenue: body.tylerRevenue || 0,
        clientWorkHours: body.clientWorkHours || 0,
        clientRevenue: body.clientRevenue || 0,
        templateSalesCount: body.templateSalesCount || 0,
        templateSalesAmount: body.templateSalesAmount || 0,
        otherIncome: body.otherIncome || 0,
        weeklyTotal,
        notes: body.notes,
      },
      create: {
        weekOf: new Date(body.weekOf),
        tylerWorkHours: body.tylerWorkHours || 0,
        tylerRevenue: body.tylerRevenue || 0,
        clientWorkHours: body.clientWorkHours || 0,
        clientRevenue: body.clientRevenue || 0,
        templateSalesCount: body.templateSalesCount || 0,
        templateSalesAmount: body.templateSalesAmount || 0,
        otherIncome: body.otherIncome || 0,
        weeklyTotal,
        notes: body.notes,
      },
    })

    return NextResponse.json(week, { status: 201 })
  } catch (error) {
    console.error('Error creating revenue week:', error)
    return NextResponse.json(
      { error: 'Failed to create revenue week' },
      { status: 500 }
    )
  }
}
