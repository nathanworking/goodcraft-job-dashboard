import { NextRequest, NextResponse } from 'next/server'
import { generateSearchQueries } from '@/services/gemini-service'
import { fetchJobListings } from '@/services/serp-service'

// Mock data for testing when APIs aren't configured
function getMockJobs(query: string, location?: string) {
  return [
    {
      id: `mock-1-${Date.now()}`,
      title: `Senior ${query} Developer`,
      company: 'TechCorp',
      location: location || 'Remote',
      description: `We are looking for an experienced ${query} developer to join our team. Work with modern technologies and build amazing products.`,
      url: 'https://example.com/job/1',
      source: 'LinkedIn',
      postedDate: 'Posted 2 days ago',
      salary: '$120k - $150k',
      jobType: 'full-time' as const
    },
    {
      id: `mock-2-${Date.now()}`,
      title: `${query} Engineer`,
      company: 'StartupXYZ',
      location: location || 'San Francisco, CA',
      description: `Join our fast-growing startup as a ${query} engineer. Build cutting-edge applications with the latest technology stack.`,
      url: 'https://example.com/job/2',
      source: 'Indeed',
      postedDate: 'Posted 1 week ago',
      salary: '$100k - $130k',
      jobType: 'full-time' as const
    },
    {
      id: `mock-3-${Date.now()}`,
      title: `Lead ${query} Developer`,
      company: 'Enterprise Solutions Inc',
      location: location || 'New York, NY',
      description: `Looking for a lead ${query} developer to mentor our team and build scalable solutions.`,
      url: 'https://example.com/job/3',
      source: 'Company Website',
      postedDate: 'Posted 3 days ago',
      salary: '$130k - $160k',
      jobType: 'full-time' as const
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, location, excludeJobBoards = false } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Check if API keys are configured
    const hasGeminiKey = !!process.env.GEMINI_API_KEY
    const hasSerpKey = !!process.env.SERP_API_KEY

    // If APIs aren't configured, return mock data with a helpful message
    if (!hasGeminiKey || !hasSerpKey) {
      console.log('⚠️  Using mock data - API keys not configured')
      return NextResponse.json({
        success: true,
        jobs: getMockJobs(query, location),
        mock: true,
        message: 'Using mock data. Add GEMINI_API_KEY and SERP_API_KEY to .env for real job search. See AI-JOB-SEARCH-SETUP.md',
        query,
        location
      })
    }

    // Step 1: Generate optimized search queries using Gemini AI
    const searchQueries = await generateSearchQueries(query, 3) // Generate 3 queries

    // Step 2: Fetch jobs from Google Jobs using the generated queries
    const jobs = await fetchJobListings(
      searchQueries.map(q => q.query),
      location,
      excludeJobBoards
    )

    return NextResponse.json({
      success: true,
      jobs,
      queries: searchQueries, // Return the queries that were used
      query,
      location
    })
  } catch (error) {
    console.error('Error in /api/search-jobs:', error)

    // Check for specific API key errors
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file. See AI-JOB-SEARCH-SETUP.md for instructions.' },
          { status: 500 }
        )
      }
      if (error.message.includes('SERP_API_KEY')) {
        return NextResponse.json(
          { error: 'SerpAPI key not configured. Please add SERP_API_KEY to your .env file. See AI-JOB-SEARCH-SETUP.md for instructions.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search jobs' },
      { status: 500 }
    )
  }
}
