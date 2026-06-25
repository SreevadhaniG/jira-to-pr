import type { LLMProvider } from "./llm.js";
import { GeminiProvider } from "./geminiProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { AnthropicProvider } from "./anthropicProvider.js";
import { GroqProvider } from "./groqProvider.js";

export function getLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER;

  if (!provider) {
    throw new Error("LLM_PROVIDER is not configured");
  }

  console.log(`Using LLM Provider: ${provider}`);

  switch (provider.toLowerCase()) {
    case "gemini": {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      return new GeminiProvider();
    }

    case "openai": {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured");
      }

      return new OpenAIProvider();
    }

    case "anthropic": {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not configured");
      }

      return new AnthropicProvider();
    }

    case "groq": {
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
      }

      return new GroqProvider();
    }

    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
