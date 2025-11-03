/**
 * SerpAPI service for fetching job listings
 */

import { getJson } from "serpapi";
import { JobListing } from "@/components/job-search";

// Common job board domains to filter out
const JOB_BOARD_DOMAINS = [
  'indeed.com',
  'linkedin.com',
  'glassdoor.com',
  'monster.com',
  'ziprecruiter.com',
  'careerbuilder.com',
  'dice.com',
  'simplyhired.com',
  'jobs.com',
  'jobrapido.com',
  'talent.com',
  'jobsdb.com',
  'seek.com',
  'jooble.org'
];

function isJobBoard(url: string): boolean {
  try {
    const domain = new URL(url).hostname.toLowerCase().replace('www.', '');
    return JOB_BOARD_DOMAINS.some(jobBoard => domain.includes(jobBoard));
  } catch {
    return false;
  }
}

function extractRealSource(job: any): string {
  // Try to get the actual company domain from via or apply links
  const viaLink = job.via;
  const applyLink = job.apply_options?.[0]?.link;

  if (viaLink && !isJobBoard(viaLink)) {
    try {
      return new URL(viaLink).hostname.replace('www.', '');
    } catch {}
  }

  if (applyLink && !isJobBoard(applyLink)) {
    try {
      return new URL(applyLink).hostname.replace('www.', '');
    } catch {}
  }

  return job.via || 'Google Jobs';
}

/**
 * Fetch job listings from Google Jobs using SerpAPI
 * @param queries - Array of search queries
 * @param location - Optional location filter
 * @param excludeJobBoards - Whether to filter out job board postings (default: false)
 * @returns Array of job listings
 */
export async function fetchJobListings(
  queries: string[],
  location?: string,
  excludeJobBoards: boolean = false
): Promise<JobListing[]> {
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    throw new Error("SERP_API_KEY is not configured");
  }

  try {
    const allJobs: JobListing[] = [];

    // Fetch jobs for each query
    for (const query of queries) {
      // Build query string - if location is "remote" or similar, add it to the query instead
      let searchQuery = query;
      let searchLocation = location || "United States";

      // Handle "Remote" as part of the search query, not location
      if (location && (location.toLowerCase().includes('remote') || location.toLowerCase() === 'remote')) {
        searchQuery = `${query} remote`;
        searchLocation = "United States"; // Use a valid location
      }

      const params = {
        api_key: apiKey,
        engine: "google_jobs",
        q: searchQuery,
        location: searchLocation,
        hl: "en",
        gl: "us",
      };

      const response = await getJson(params);

      // Parse response and extract job listings
      if (response.jobs_results && Array.isArray(response.jobs_results)) {
        let jobs = response.jobs_results.map(
          (job: any, index: number): JobListing => {
            const realSource = extractRealSource(job);
            return {
              id: `${query}-${index}-${Date.now()}`,
              title: job.title || "Untitled Position",
              company: job.company_name || "Unknown Company",
              location: job.location || "Location not specified",
              description: job.description || "",
              url: job.share_url || job.apply_options?.[0]?.link || "#",
              source: realSource,
              postedDate: job.detected_extensions?.posted_at || undefined,
              salary: job.detected_extensions?.salary || undefined,
              jobType: extractJobType(job.detected_extensions?.schedule_type),
            };
          }
        );

        // Filter out job boards if requested
        if (excludeJobBoards) {
          jobs = jobs.filter(job => {
            const viaLink = response.jobs_results.find((origJob: any) =>
              origJob.title === job.title && origJob.company_name === job.company
            )?.via;
            return viaLink ? !isJobBoard(viaLink) : true;
          });
        }

        allJobs.push(...jobs);
      }
    }

    // Remove duplicates based on title + company
    const uniqueJobs = Array.from(
      new Map(
        allJobs.map((job) => [`${job.title}-${job.company}`, job])
      ).values()
    );

    return uniqueJobs;
  } catch (error) {
    console.error("Error fetching job listings:", error);
    throw new Error(
      `Failed to fetch job listings: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Extract standardized job type from SerpAPI schedule type
 */
function extractJobType(
  scheduleType?: string
): JobListing["jobType"] | undefined {
  if (!scheduleType) return undefined;

  const lower = scheduleType.toLowerCase();
  if (lower.includes("full")) return "full-time";
  if (lower.includes("part")) return "part-time";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("intern")) return "internship";

  return undefined;
}
