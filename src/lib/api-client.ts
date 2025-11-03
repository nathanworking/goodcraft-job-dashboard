/**
 * Base API client configuration
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch wrapper with error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
