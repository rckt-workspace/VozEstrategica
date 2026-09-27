/**
 * OpenRouter LLM Provider
 * Server-side only. Never expose API key to client.
 * Supports streaming and non-streaming responses.
 */

const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature: number;
  max_tokens: number;
}

interface LLMResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenRouter API for chat completion.
 * Requires OPENROUTER_API_KEY in process.env.
 */
export async function callOpenRouter(
  messages: LLMMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
  },
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY not configured. Set it in environment variables.",
    );
  }

  const model =
    options?.model || process.env.CHAT_PRIMARY_LLM || "openrouter/free";
  const temperature = options?.temperature ?? 0.2;
  const maxTokens = options?.maxTokens ?? 900;
  const timeout = options?.timeout ?? 30000;

  const request: LLMRequest = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://vozestrategica.com",
        "X-Title": "Voz Estrategica",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("[OpenRouter] API error:", response.status, error);

      if (response.status === 401) {
        throw new Error("Invalid OpenRouter API key");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Try again later.");
      }
      if (response.status >= 500) {
        throw new Error("OpenRouter service temporarily unavailable");
      }

      throw new Error(`OpenRouter error: ${response.statusText}`);
    }

    const data: LLMResponse = await response.json();

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message?.content
    ) {
      throw new Error("Invalid response from OpenRouter");
    }

    return data.choices[0].message.content;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes("aborted")) {
      throw new Error(
        "LLM request timeout (30s). Try a simpler prompt or try again.",
      );
    }
    throw err;
  }
}

/**
 * Verify OpenRouter is properly configured.
 * Useful for startup checks.
 */
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

/**
 * Get current LLM model configuration.
 */
export function getLLMConfig() {
  return {
    model: process.env.CHAT_PRIMARY_LLM || "openrouter/free",
    temperature:
      parseFloat(process.env.CHAT_TEMPERATURE || "0.2") || 0.2,
    maxTokens: parseInt(process.env.CHAT_MAX_TOKENS || "900") || 900,
    baseUrl: OPENROUTER_BASE_URL,
    configured: isOpenRouterConfigured(),
  };
}
