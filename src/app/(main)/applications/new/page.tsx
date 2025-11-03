'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Textarea } from '@/components/textarea'
import { Button } from '@/components/button'
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'

export default function NewApplicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      company: formData.get('company'),
      jobTitle: formData.get('jobTitle'),
      url: formData.get('url'),
      resumeVersion: formData.get('resumeVersion'),
      status: formData.get('status') || 'Applied',
      source: formData.get('source'),
      notes: formData.get('notes'),
      followUpDate: formData.get('followUpDate') || null,
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create application')
      }

      router.push('/applications')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <Heading className="mb-6">Add New Application</Heading>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Fieldset>
          <FieldGroup>
            <Field>
              <Label>Company *</Label>
              <Input name="company" required placeholder="Acme Corp" />
            </Field>

            <Field>
              <Label>Job Title *</Label>
              <Input name="jobTitle" required placeholder="Frontend Developer" />
            </Field>

            <Field>
              <Label>Job Posting URL</Label>
              <Input
                name="url"
                type="url"
                placeholder="https://company.com/careers/job"
              />
            </Field>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field>
                <Label>Resume Version *</Label>
                <Select name="resumeVersion" required>
                  <option value="">Select version...</option>
                  <option value="Webflow">Webflow Developer</option>
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Full-Stack">Full-Stack Developer</option>
                </Select>
              </Field>

              <Field>
                <Label>Status</Label>
                <Select name="status">
                  <option value="Applied">Applied</option>
                  <option value="Responded">Responded</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Field>
                <Label>Source</Label>
                <Select name="source">
                  <option value="">Select source...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Built In">Built In</option>
                  <option value="We Work Remotely">We Work Remotely</option>
                  <option value="Remote OK">Remote OK</option>
                  <option value="AngelList">AngelList</option>
                  <option value="Webflow Jobs">Webflow Jobs</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </Select>
              </Field>

              <Field>
                <Label>Follow-up Date</Label>
                <Input
                  name="followUpDate"
                  type="date"
                  defaultValue={
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0]
                  }
                />
              </Field>
            </div>

            <Field>
              <Label>Notes</Label>
              <Textarea
                name="notes"
                placeholder="Any special details about this application..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          <div className="mt-8 flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Application'}
            </Button>
            <Button
              type="button"
              plain
              onClick={() => router.push('/applications')}
            >
              Cancel
            </Button>
          </div>
        </Fieldset>
      </form>
    </div>
  )
}
