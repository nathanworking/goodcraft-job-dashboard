import { Heading } from '@/components/heading'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { prisma } from '@/lib/prisma'
import { Stat } from '@/app/stat'

export default async function DashboardPage() {
  // Get this week's date range
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Fetch all data
  const [
    totalApplications,
    applicationsThisWeek,
    revenueWeeks,
    networkContacts,
    contentPosts,
    latestReview,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({
      where: { dateApplied: { gte: startOfWeek } },
    }),
    prisma.revenueWeek.findMany({
      orderBy: { weekOf: 'desc' },
      take: 4,
    }),
    prisma.networkContact.count({
      where: { dateContacted: { gte: startOfWeek } },
    }),
    prisma.contentPost.count({
      where: {
        scheduledDate: { gte: startOfWeek },
        done: true,
      },
    }),
    prisma.weeklyReview.findFirst({
      orderBy: { weekOf: 'desc' },
    }),
  ])

  // Calculate metrics
  const monthlyRevenue = revenueWeeks.reduce((sum, week) => sum + week.weeklyTotal, 0)
  const monthlyGoal = 8000
  const revenueProgress = ((monthlyRevenue / monthlyGoal) * 100).toFixed(0)

  const applicationsGoal = 50
  const applicationsProgress = ((applicationsThisWeek / applicationsGoal) * 100).toFixed(0)

  const networkGoal = 5
  const networkProgress = ((networkContacts / networkGoal) * 100).toFixed(0)

  const contentGoal = 3
  const contentProgress = ((contentPosts / contentGoal) * 100).toFixed(0)

  return (
    <div className="p-8">
      <Heading className="mb-8">Dashboard</Heading>

      {/* This Week's Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">This Week&apos;s Progress</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            title="Job Applications"
            value={`${applicationsThisWeek} / ${applicationsGoal}`}
            change={`${applicationsProgress}%`}
          />
          <Stat
            title="Revenue (Last 4 Weeks)"
            value={`$${monthlyRevenue.toFixed(0)} / $${monthlyGoal}`}
            change={`${revenueProgress}%`}
          />
          <Stat
            title="Network Outreach"
            value={`${networkContacts} / ${networkGoal}`}
            change={`${networkProgress}%`}
          />
          <Stat
            title="Content Posted"
            value={`${contentPosts} / ${contentGoal}`}
            change={`${contentProgress}%`}
          />
        </div>
      </div>

      {/* Overall Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overall Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Total Applications</div>
            <div className="text-3xl font-bold mt-1">{totalApplications}</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Monthly Revenue</div>
            <div className="text-3xl font-bold mt-1">${monthlyRevenue.toFixed(2)}</div>
            <div className="mt-2">
              <Badge color={monthlyRevenue >= monthlyGoal ? 'lime' : 'red'}>
                {monthlyRevenue >= monthlyGoal ? 'On Track' : 'Behind Goal'}
              </Badge>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Weeks Tracked</div>
            <div className="text-3xl font-bold mt-1">{revenueWeeks.length}</div>
          </div>
        </div>
      </div>

      {/* Latest Weekly Review */}
      {latestReview && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Latest Weekly Review</h2>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-zinc-500">
                Week of {new Date(latestReview.weekOf).toLocaleDateString()}
              </div>
              <Button href="/reviews" outline>
                View All Reviews
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div>
                <div className="text-xs text-zinc-500">Applications</div>
                <div className="text-xl font-semibold">{latestReview.jobApplications}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Deep Work</div>
                <div className="text-xl font-semibold">{latestReview.deepWorkHours}h</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Revenue</div>
                <div className="text-xl font-semibold">${latestReview.revenueThisWeek}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Content</div>
                <div className="text-xl font-semibold">{latestReview.contentPosted}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Outreach</div>
                <div className="text-xl font-semibold">{latestReview.networkOutreach}</div>
              </div>
            </div>

            {latestReview.wins && (
              <div>
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  This Week&apos;s Wins
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {latestReview.wins}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button href="/applications/new">Add Application</Button>
          <Button href="/applications" outline>
            View Applications
          </Button>
          <Button href="/revenue" outline>
            Track Revenue
          </Button>
          <Button href="/network" outline>
            Network Outreach
          </Button>
        </div>
      </div>
    </div>
  )
}
