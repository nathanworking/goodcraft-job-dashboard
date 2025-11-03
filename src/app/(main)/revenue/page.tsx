import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { prisma } from '@/lib/prisma'

export default async function RevenuePage() {
  const weeks = await prisma.revenueWeek.findMany({
    orderBy: { weekOf: 'desc' },
  })

  // Calculate monthly total (last 4 weeks)
  const last4Weeks = weeks.slice(0, 4)
  const monthlyTotal = last4Weeks.reduce((sum, week) => sum + week.weeklyTotal, 0)
  const monthlyGoal = 8000
  const onTrack = monthlyTotal >= monthlyGoal
  const gapToClose = Math.max(0, monthlyGoal - monthlyTotal)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Heading>Revenue Tracking</Heading>
      </div>

      {/* Monthly Summary */}
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-zinc-500">Monthly Total (Last 4 Weeks)</div>
            <div className="text-3xl font-bold mt-1">${monthlyTotal.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Monthly Goal</div>
            <div className="text-2xl font-semibold mt-1">${monthlyGoal.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Gap to Close</div>
            <div className="text-2xl font-semibold mt-1 text-red-600">
              {gapToClose > 0 ? `-$${gapToClose.toFixed(2)}` : '$0.00'}
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">On Track?</div>
            <div className="mt-1">
              <Badge color={onTrack ? 'lime' : 'red'}>
                {onTrack ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      {weeks.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No revenue data yet. Start tracking your weekly earnings!
        </div>
      ) : (
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Week Of</TableHeader>
              <TableHeader>Tyler Hours</TableHeader>
              <TableHeader>Tyler Revenue</TableHeader>
              <TableHeader>Client Hours</TableHeader>
              <TableHeader>Client Revenue</TableHeader>
              <TableHeader>Template Sales</TableHeader>
              <TableHeader>Other Income</TableHeader>
              <TableHeader className="text-right">Weekly Total</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week) => (
              <TableRow key={week.id}>
                <TableCell className="font-medium">
                  {new Date(week.weekOf).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {week.tylerWorkHours.toFixed(1)}h
                </TableCell>
                <TableCell className="text-zinc-500">
                  ${week.tylerRevenue.toFixed(2)}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {week.clientWorkHours.toFixed(1)}h
                </TableCell>
                <TableCell className="text-zinc-500">
                  ${week.clientRevenue.toFixed(2)}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {week.templateSalesCount} (${week.templateSalesAmount.toFixed(2)})
                </TableCell>
                <TableCell className="text-zinc-500">
                  ${week.otherIncome.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${week.weeklyTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 text-sm text-zinc-500">
        Total weeks tracked: {weeks.length} | Average weekly: $
        {weeks.length > 0 ? (weeks.reduce((sum, w) => sum + w.weeklyTotal, 0) / weeks.length).toFixed(2) : '0.00'}
      </div>
    </div>
  )
}
