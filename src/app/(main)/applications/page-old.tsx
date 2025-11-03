'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { EditableCell, QuickAddRow } from '@/components/editable-table'

interface Application {
  id: string
  dateApplied: string
  company: string
  jobTitle: string
  url?: string | null
  resumeVersion: string
  status: string
  followUpDate?: string | null
  notes?: string | null
  source?: string | null
}

function getStatusColor(status: string): 'zinc' | 'red' | 'yellow' | 'lime' | 'cyan' {
  switch (status) {
    case 'Offer':
      return 'lime'
    case 'Interview':
      return 'cyan'
    case 'Responded':
      return 'yellow'
    case 'Rejected':
      return 'red'
    default:
      return 'zinc'
  }
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleUpdateCell = async (id: string, field: string, value: string) => {
    try {
      // Optimistically update UI
      setApplications((apps) =>
        apps.map((app) => (app.id === id ? { ...app, [field]: value } : app))
      )

      // TODO: Add API endpoint for PATCH/PUT to update individual fields
      // For now, we'll just update the UI
      console.log('Update:', { id, field, value })
    } catch (error) {
      console.error('Failed to update:', error)
      // Revert on error
      fetchApplications()
    }
  }

  const handleAddApplication = async (data: Record<string, string>) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: data.company,
          jobTitle: data.jobTitle,
          resumeVersion: data.resumeVersion,
          status: data.status || 'Applied',
          source: data.source,
          url: data.url,
          followUpDate: data.followUpDate || null,
        }),
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Failed to add application:', error)
    }
  }

  const quickAddColumns = [
    {
      key: 'company',
      label: 'Company',
      placeholder: 'Acme Corp',
      required: true,
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      placeholder: 'Frontend Developer',
      required: true,
    },
    {
      key: 'resumeVersion',
      label: 'Resume',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Webflow', label: 'Webflow' },
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Full-Stack', label: 'Full-Stack' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'Applied', label: 'Applied' },
        { value: 'Responded', label: 'Responded' },
        { value: 'Interview', label: 'Interview' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Offer', label: 'Offer' },
      ],
    },
    {
      key: 'source',
      label: 'Source',
      type: 'select' as const,
      options: [
        { value: 'LinkedIn', label: 'LinkedIn' },
        { value: 'Indeed', label: 'Indeed' },
        { value: 'Built In', label: 'Built In' },
        { value: 'We Work Remotely', label: 'We Work Remotely' },
        { value: 'Company Website', label: 'Company Website' },
      ],
    },
    {
      key: 'url',
      label: 'URL',
      placeholder: 'https://...',
    },
  ]

  const resumeOptions = [
    { value: 'Webflow', label: 'Webflow' },
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Full-Stack', label: 'Full-Stack' },
  ]

  const statusOptions = [
    { value: 'Applied', label: 'Applied' },
    { value: 'Responded', label: 'Responded' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Offer', label: 'Offer' },
  ]

  const sourceOptions = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'Built In', label: 'Built In' },
    { value: 'We Work Remotely', label: 'We Work Remotely' },
    { value: 'Remote OK', label: 'Remote OK' },
    { value: 'AngelList', label: 'AngelList' },
    { value: 'Company Website', label: 'Company Website' },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Heading>Job Applications</Heading>
        <Button href="/applications/new">Add Application (Form)</Button>
      </div>

      <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        💡 <strong>Excel-like editing:</strong> Click any cell to edit. Press Enter to save, Escape to cancel.
        Click the &quot;+&quot; row at the bottom to quickly add new applications.
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No applications yet. Click below to add your first one!
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
          <TableHead>
            <TableRow>
              <TableHeader>Date Applied</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Job Title</TableHeader>
              <TableHeader>Resume</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Source</TableHeader>
              <TableHeader>URL</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="text-zinc-500">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={app.company}
                    onSave={(value) => handleUpdateCell(app.id, 'company', value)}
                    placeholder="Company name"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={app.jobTitle}
                    onSave={(value) => handleUpdateCell(app.id, 'jobTitle', value)}
                    placeholder="Job title"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={app.resumeVersion}
                    onSave={(value) => handleUpdateCell(app.id, 'resumeVersion', value)}
                    type="select"
                    options={resumeOptions}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge color={getStatusColor(app.status)}>{app.status}</Badge>
                    <EditableCell
                      value={app.status}
                      onSave={(value) => handleUpdateCell(app.id, 'status', value)}
                      type="select"
                      options={statusOptions}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={app.source}
                    onSave={(value) => handleUpdateCell(app.id, 'source', value)}
                    type="select"
                    options={sourceOptions}
                    placeholder="Source"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={app.url}
                    onSave={(value) => handleUpdateCell(app.id, 'url', value)}
                    placeholder="Job URL"
                  />
                </TableCell>
              </TableRow>
            ))}
            <QuickAddRow columns={quickAddColumns} onAdd={handleAddApplication} />
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 text-sm text-zinc-500">
        Total applications: {applications.length}
      </div>
    </div>
  )
}
