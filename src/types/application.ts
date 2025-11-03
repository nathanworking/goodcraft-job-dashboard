/**
 * Type definitions for Job Applications
 */

export interface Application {
  id: string
  dateApplied: Date
  company: string
  jobTitle: string
  url?: string | null
  resumeVersion: string
  status: string
  followUpDate?: Date | null
  notes?: string | null
  source?: string | null
  createdAt: Date
  updatedAt: Date
}

export type CreateApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateApplicationInput = Partial<CreateApplicationInput>

export interface ApplicationFilters {
  status?: string
  source?: string
  company?: string
  resumeVersion?: string
  dateFrom?: Date
  dateTo?: Date
}
