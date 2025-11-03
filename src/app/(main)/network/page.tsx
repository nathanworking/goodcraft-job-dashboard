import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { prisma } from '@/lib/prisma'

export default async function NetworkPage() {
  const contacts = await prisma.networkContact.findMany({
    orderBy: { dateContacted: 'desc' },
  })

  // Calculate stats
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()) // Start of week
  const contactsThisWeek = contacts.filter(
    (c) => new Date(c.dateContacted) >= thisWeek
  ).length
  const weeklyGoal = 5
  const respondedCount = contacts.filter((c) => c.responded).length
  const responseRate = contacts.length > 0
    ? ((respondedCount / contacts.length) * 100).toFixed(1)
    : '0.0'

  function getOutcomeColor(outcome: string | null): 'zinc' | 'lime' | 'red' | 'yellow' {
    if (!outcome) return 'zinc'
    switch (outcome) {
      case 'Deal':
        return 'lime'
      case 'Nothing':
        return 'red'
      case 'Pending':
        return 'yellow'
      default:
        return 'zinc'
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Heading>Network & Outreach</Heading>
      </div>

      {/* Weekly Summary */}
      <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-zinc-500">This Week</div>
            <div className="text-3xl font-bold mt-1">{contactsThisWeek}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Weekly Goal</div>
            <div className="text-2xl font-semibold mt-1">{weeklyGoal}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Response Rate</div>
            <div className="text-2xl font-semibold mt-1">{responseRate}%</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">On Track?</div>
            <div className="mt-1">
              <Badge color={contactsThisWeek >= weeklyGoal ? 'lime' : 'yellow'}>
                {contactsThisWeek >= weeklyGoal ? 'Yes' : 'Not Yet'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      {contacts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No contacts yet. Start building your network!
        </div>
      ) : (
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Date</TableHeader>
              <TableHeader>Contact Name</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Method</TableHeader>
              <TableHeader>Purpose</TableHeader>
              <TableHeader>Responded</TableHeader>
              <TableHeader>Outcome</TableHeader>
              <TableHeader>Follow-up</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="text-zinc-500">
                  {new Date(contact.dateContacted).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{contact.contactName}</TableCell>
                <TableCell className="text-zinc-500">{contact.company || '-'}</TableCell>
                <TableCell className="text-zinc-500">{contact.method}</TableCell>
                <TableCell className="text-zinc-500">{contact.purpose}</TableCell>
                <TableCell>
                  <Badge color={contact.responded ? 'lime' : 'zinc'}>
                    {contact.responded ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {contact.outcome ? (
                    <Badge color={getOutcomeColor(contact.outcome)}>
                      {contact.outcome}
                    </Badge>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {contact.followUpDate
                    ? new Date(contact.followUpDate).toLocaleDateString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 text-sm text-zinc-500">
        Total contacts: {contacts.length} | Responded: {respondedCount}
      </div>
    </div>
  )
}
