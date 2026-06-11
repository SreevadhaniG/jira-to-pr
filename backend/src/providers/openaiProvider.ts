import type { LLMProvider } from "./llm.js";
import type { PullRequestDraft } from "../types/pr.js";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await client.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    return response.output_text;
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    return "Temporary Commit Message";
  }

  async generatePR(prompt: string): Promise<PullRequestDraft> {
    return {
      title: "Temporary PR",
      description: "Temporary Description",
    };
  }
}
