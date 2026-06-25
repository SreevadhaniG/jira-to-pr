import type { LLMProvider } from "./llm.js";
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
}
