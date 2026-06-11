import { GoogleGenAI } from "@google/genai";
import type { LLMProvider } from "./llm.js";
import type { PullRequestDraft } from "../types/pr.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const client = new GoogleGenAI({
  apiKey,
});

export class GeminiProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text ?? "";
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text ?? "";
  }

  async generatePR(prompt: string): Promise<PullRequestDraft> {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";

    console.log("Raw PR Response:");

    console.log(text);

    const pr = JSON.parse(text) as PullRequestDraft;

    return pr;
  }
}
