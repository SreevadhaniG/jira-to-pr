import Groq from "groq-sdk";
import type { LLMProvider } from "./llm.js";
import type { PullRequestDraft } from "../types/pr.js";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not configured");
}

const client = new Groq({
  apiKey,
});

export class GroqProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  }

  async generatePR(prompt: string): Promise<PullRequestDraft> {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content ?? "";

    console.log("Raw PR Response:");

    console.log(text);

    const pr = JSON.parse(text) as PullRequestDraft;

    return pr;
  }
}
