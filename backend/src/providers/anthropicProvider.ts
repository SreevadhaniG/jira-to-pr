import Anthropic from "@anthropic-ai/sdk";

import type { LLMProvider } from "./llm.js";
import type { PullRequestDraft } from "../types/pr.js";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY is not configured");
}

const client = new Anthropic({
  apiKey,
});

export class AnthropicProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await client.messages.create({
      model: "claude-sonnet-4",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];

    if (!content) {
      throw new Error("Claude returned no content");
    }

    if (content.type !== "text") {
      throw new Error("Unexpected Claude response");
    }

    return content.text;
  }

  async generateCommitMessage(prompt: string): Promise<string> {
    const response = await client.messages.create({
      model: "claude-sonnet-4",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];

    if (!content) {
      throw new Error("Claude returned no content");
    }

    if (content.type !== "text") {
      throw new Error("Unexpected Claude response");
    }

    return content.text.trim();
  }

  async generatePR(prompt: string): Promise<PullRequestDraft> {
    const response = await client.messages.create({
      model: "claude-sonnet-4",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];

    if (!content) {
      throw new Error("Claude returned no content");
    }

    if (content.type !== "text") {
      throw new Error("Unexpected Claude response");
    }

    return JSON.parse(content.text) as PullRequestDraft;
  }
}
