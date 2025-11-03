/**
 * Gemini API service for generating search queries
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SearchQuery {
  id: string;
  query: string;
  category?: string;
}

/**
 * Get Gemini AI client instance
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generate job search queries from a user prompt using Gemini AI
 * @param prompt - User's job search description
 * @param numQueries - Number of queries to generate (default: 5)
 * @returns Array of search queries
 */
export async function generateSearchQueries(
  prompt: string,
  numQueries: number = 5
): Promise<SearchQuery[]> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemPrompt = `You are a job search expert. Generate ${numQueries} diverse, effective Google search queries for job listings based on the user's description.

Rules:
1. Make queries specific and actionable
2. Include relevant job titles, skills, and keywords
3. Vary the approach (e.g., "software engineer jobs", "hiring developers", "react developer positions")
4. Return ONLY a JSON array of objects with this structure: [{"id": "1", "query": "search query here", "category": "optional category"}]
5. No markdown formatting, just pure JSON

User prompt: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const queries: SearchQuery[] = JSON.parse(cleanedText);

    return queries;
  } catch (error) {
    console.error("Error generating queries:", error);
    throw new Error(
      `Failed to generate search queries: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
