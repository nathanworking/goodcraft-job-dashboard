'use client'

import { useState } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid'

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  description: string
  url: string
  source: string
  postedDate?: string
  salary?: string
  jobType?: string
}

interface JobSearchProps {
  onSelectJob: (job: JobListing) => void
}

interface SearchHistory {
  id: string
  query: string
  location: string
  excludeJobBoards: boolean
  jobs: JobListing[]
  timestamp: number
  mock: boolean
}

export function JobSearch({ onSelectJob }: JobSearchProps) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchStatus, setSearchStatus] = useState<string>('')
  const [rejectedJobs, setRejectedJobs] = useState<Set<string>>(new Set())
  const [isMockData, setIsMockData] = useState(false)
  const [excludeJobBoards, setExcludeJobBoards] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)
    setRejectedJobs(new Set())

    try {
      setSearchStatus('🤖 Generating search queries with AI...')
      await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause to show status

      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          location: location.trim() || undefined,
          excludeJobBoards
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search jobs')
      }

      setSearchStatus('🔍 Searching Google Jobs...')
      const data = await response.json()
      const jobResults = data.jobs || []
      setJobs(jobResults)
      setIsMockData(data.mock || false)
      setSearchStatus('')

      // Add to search history
      const historyEntry: SearchHistory = {
        id: `search-${Date.now()}`,
        query: query.trim(),
        location: location.trim(),
        excludeJobBoards,
        jobs: jobResults,
        timestamp: Date.now(),
        mock: data.mock || false
      }
      setSearchHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Keep last 10 searches
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs')
      setJobs([])
      setSearchStatus('')
    } finally {
      setIsSearching(false)
    }
  }

  const handleConfirmJob = async (job: JobListing) => {
    await onSelectJob(job)
  }

  const handleRejectJob = (jobId: string) => {
    setRejectedJobs(prev => new Set(prev).add(jobId))
  }

  const handleRestoreSearch = (history: SearchHistory) => {
    setQuery(history.query)
    setLocation(history.location)
    setExcludeJobBoards(history.excludeJobBoards)
    setJobs(history.jobs)
    setIsMockData(history.mock)
    setRejectedJobs(new Set())
    setError(null)
    setShowHistory(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for jobs (e.g., 'Frontend Developer React')"
            disabled={isSearching}
          />
        </div>
        <div className="w-48">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Location (optional)"
            disabled={isSearching}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        {searchHistory.length > 0 && (
          <Button
            plain
            onClick={() => setShowHistory(!showHistory)}
            disabled={isSearching}
          >
            History ({searchHistory.length})
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="exclude-job-boards"
          checked={excludeJobBoards}
          onChange={(e) => setExcludeJobBoards(e.target.checked)}
          disabled={isSearching}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
        />
        <label
          htmlFor="exclude-job-boards"
          className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          Exclude job boards (search company sites only - deeper search, fewer results)
        </label>
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Recent Searches</h4>
          <div className="space-y-1">
            {searchHistory.map((history) => (
              <button
                key={history.id}
                onClick={() => handleRestoreSearch(history)}
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {history.query}
                      {history.location && (
                        <span className="text-zinc-500 dark:text-zinc-400"> in {history.location}</span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {history.jobs.length} jobs • {new Date(history.timestamp).toLocaleString()}
                      {history.excludeJobBoards && ' • No job boards'}
                      {history.mock && ' • Mock data'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingSpinner className="w-16 h-16 text-blue-500" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{searchStatus}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {!isSearching && jobs.length > 0 && (
        <div className="space-y-2">
          {isMockData && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              ⚠️ <strong>Mock Data:</strong> Add GEMINI_API_KEY and SERP_API_KEY to .env for real job search.
              See <code className="text-xs">AI-JOB-SEARCH-SETUP.md</code>
            </div>
          )}
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Found {jobs.filter(j => !rejectedJobs.has(j.id)).length} jobs {isMockData ? '(sample data)' : ''}
          </h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {jobs
              .filter(job => !rejectedJobs.has(job.id))
              .map((job) => (
                <div
                  key={job.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header with company and title */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                            {job.company}
                          </h4>
                          {job.salary && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                              {job.salary}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {job.title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {job.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {job.jobType && (
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                          {job.jobType}
                        </span>
                      )}
                      {job.postedDate && (
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                          {job.postedDate}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        via {job.source}
                      </span>
                    </div>

                    {/* Link preview and action buttons */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-xs"
                          title={job.url}
                        >
                          {job.url}
                        </a>
                        <Button
                          plain
                          onClick={() => window.open(job.url, '_blank')}
                          title="Open job posting in new tab"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                          <span className="text-sm">Open Posting</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          color="red"
                          onClick={() => handleRejectJob(job.id)}
                          title="Reject this job"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          color="green"
                          onClick={() => handleConfirmJob(job)}
                          title="Add to applications"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!isSearching && jobs.length === 0 && query && !error && (
        <div className="text-center py-8 text-zinc-500">
          No jobs found. Try a different search query.
        </div>
      )}
    </div>
  )
}
