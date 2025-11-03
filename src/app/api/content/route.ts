import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/content
 * Fetch content posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weekOf = searchParams.get('weekOf')
    const done = searchParams.get('done')

    const posts = await prisma.contentPost.findMany({
      where: {
        ...(weekOf && { weekOf: new Date(weekOf) }),
        ...(done !== null && { done: done === 'true' }),
      },
      orderBy: { scheduledDate: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching content posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content posts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/content
 * Create a new content post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const post = await prisma.contentPost.create({
      data: {
        weekOf: new Date(body.weekOf),
        scheduledDate: new Date(body.scheduledDate),
        dayOfWeek: body.dayOfWeek,
        topic: body.topic,
        done: body.done || false,
        engagementLikes: body.engagementLikes || 0,
        engagementComments: body.engagementComments || 0,
        engagementShares: body.engagementShares || 0,
        leadsGenerated: body.leadsGenerated || 0,
        notes: body.notes,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating content post:', error)
    return NextResponse.json(
      { error: 'Failed to create content post' },
      { status: 500 }
    )
  }
}
