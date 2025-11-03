import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { prisma } from '@/lib/prisma'

export default async function ContentPage() {
  const posts = await prisma.contentPost.findMany({
    orderBy: { scheduledDate: 'desc' },
  })

  // Calculate stats
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay())
  const postsThisWeek = posts.filter(
    (p) => new Date(p.scheduledDate) >= thisWeek && p.done
  ).length
  const weeklyGoal = 3

  const totalEngagement = posts.reduce(
    (sum, p) => sum + p.engagementLikes + p.engagementComments + p.engagementShares,
    0
  )
  const totalLeads = posts.reduce((sum, p) => sum + p.leadsGenerated, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Heading>Content Calendar</Heading>
      </div>

      {/* Weekly Summary */}
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-zinc-500">Posted This Week</div>
            <div className="text-3xl font-bold mt-1">{postsThisWeek}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Weekly Goal</div>
            <div className="text-2xl font-semibold mt-1">{weeklyGoal}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Total Engagement</div>
            <div className="text-2xl font-semibold mt-1">{totalEngagement}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Leads Generated</div>
            <div className="text-2xl font-semibold mt-1 text-lime-600">{totalLeads}</div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No content posts yet. Start planning your content!
        </div>
      ) : (
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Scheduled Date</TableHeader>
              <TableHeader>Day</TableHeader>
              <TableHeader>Topic</TableHeader>
              <TableHeader>Done</TableHeader>
              <TableHeader>Likes</TableHeader>
              <TableHeader>Comments</TableHeader>
              <TableHeader>Shares</TableHeader>
              <TableHeader>Leads</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="text-zinc-500">
                  {new Date(post.scheduledDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{post.dayOfWeek}</TableCell>
                <TableCell className="text-zinc-500">
                  {post.topic || <span className="text-zinc-400">Not set</span>}
                </TableCell>
                <TableCell>
                  <Badge color={post.done ? 'lime' : 'zinc'}>
                    {post.done ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">{post.engagementLikes}</TableCell>
                <TableCell className="text-zinc-500">{post.engagementComments}</TableCell>
                <TableCell className="text-zinc-500">{post.engagementShares}</TableCell>
                <TableCell className="font-medium text-lime-600">
                  {post.leadsGenerated || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 text-sm text-zinc-500">
        Total posts: {posts.length} | Completed: {posts.filter((p) => p.done).length}
      </div>
    </div>
  )
}
