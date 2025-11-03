import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { prisma } from '@/lib/prisma'

export default async function ReviewsPage() {
  const reviews = await prisma.weeklyReview.findMany({
    orderBy: { weekOf: 'desc' },
  })

  function getMetricColor(actual: number, target: number): 'lime' | 'yellow' | 'red' {
    const percentage = (actual / target) * 100
    if (percentage >= 100) return 'lime'
    if (percentage >= 75) return 'yellow'
    return 'red'
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Heading>Weekly Reviews</Heading>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No weekly reviews yet. Start tracking your progress every Friday!
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Week of {new Date(review.weekOf).toLocaleDateString()}
                  </h3>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <div className="text-sm text-zinc-500">Job Applications</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-2xl font-bold">{review.jobApplications}</div>
                    <Badge color={getMetricColor(review.jobApplications, 50)}>
                      / 50
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Deep Work Hours</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-2xl font-bold">{review.deepWorkHours}</div>
                    <Badge color={getMetricColor(review.deepWorkHours, 14)}>
                      / 14
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Revenue</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-2xl font-bold">${review.revenueThisWeek}</div>
                    <Badge color={getMetricColor(review.revenueThisWeek, 2000)}>
                      / $2k
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Content Posted</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-2xl font-bold">{review.contentPosted}</div>
                    <Badge color={getMetricColor(review.contentPosted, 3)}>
                      / 3
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Network Outreach</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-2xl font-bold">{review.networkOutreach}</div>
                    <Badge color={getMetricColor(review.networkOutreach, 5)}>
                      / 5
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Notes Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {review.wins && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Wins
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {review.wins}
                    </p>
                  </div>
                )}

                {review.blockers && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Blockers
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {review.blockers}
                    </p>
                  </div>
                )}

                {review.meetingsNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Meetings
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {review.meetingsNotes}
                    </p>
                  </div>
                )}

                {review.actionItems && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Action Items
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {review.actionItems}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-sm text-zinc-500">Total reviews: {reviews.length}</div>
    </div>
  )
}
