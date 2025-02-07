import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const DEFAULT_PROMPT = `You are a professional networking assistant. Analyze the following LinkedIn profile JSON data and create a SHORT summary that highlights the most important key metrics for deciding how to approach this person at events. Focus on:

Current and past job roles (highlight notable companies like FAANG or startups).
Key skills or expertise (e.g., backend development, machine learning).
Geographic location (where they are based and where they are from).
Notable activities or interests (e.g., hackathons, open-source contributions).
Any other unique or standout details (e.g., awards, certifications, or publications).

Format the summary concisely, like this example:
'3 years at Netflix, backend developer, specializes in machine learning, from London, based in Basel; regularly attends hackathons.'`;

export async function POST(request: NextRequest) {
  try {
    const { linkedinData } = await request.json();

    if (!linkedinData) {
      return new Response("LinkedIn data is required", { status: 400 });
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `${DEFAULT_PROMPT}\n\n${JSON.stringify(linkedinData)}`,
    });

    return new Response(JSON.stringify({ summary: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return new Response("Error generating AI summary", { status: 500 });
  }
}
