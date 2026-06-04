---
name: claude-api
label: Claude API
description: |
  Build, debug, and optimize Claude API / Anthropic SDK apps with prompt caching.
  TRIGGER when: code imports `anthropic` or `@anthropic-ai/sdk`; user asks about the
  Claude API, Anthropic SDK, tool use, streaming, or prompt caching; user adds or
  tunes a Claude feature (caching, thinking, tool use, batch, files, citations).
  SKIP: file imports `openai` or other provider SDKs; provider-neutral code; general
  programming questions with no Anthropic SDK usage.
version: "1.0.0"
author: PierDeRogatis
tags: [claude, anthropic, sdk, api, prompt-caching, tool-use]
---

# Claude API

## Overview

Patterns for the `@anthropic-ai/sdk` (TypeScript/Node.js) and `anthropic` (Python) SDKs. Prompt caching is **mandatory** on all production API calls — it cuts costs and latency when system prompts are large.

## Current Models (as of 2026)

| Model | ID | Use case |
|-------|-----|----------|
| Claude Opus 4.8 | `claude-opus-4-8` | Deep reasoning, complex tasks |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | General coding, production default |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Fast, high-volume, simple tasks |

Default to `claude-sonnet-4-6` unless there is a specific reason to use Opus or Haiku.

## Prompt Caching

Prompt caching is the highest-ROI optimization for any Claude API app. Add it by default.

**TypeScript:**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are a helpful assistant. [Long system prompt...]",
      cache_control: { type: "ephemeral" },  // Cache this block
    },
  ],
  messages: [{ role: "user", content: userMessage }],
});
```

**Rules for caching:**
- Add `cache_control: { type: "ephemeral" }` to the last content block you want cached.
- Cached content must be ≥1024 tokens (Sonnet/Opus) or ≥2048 tokens (Haiku) to qualify.
- Cache TTL: 5 minutes. Re-send with the same cache_control marker to extend.
- Cache static content (system prompts, reference docs) — not dynamic user messages.

## Tool Use

```typescript
const tools: Anthropic.Tool[] = [
  {
    name: "get_weather",
    description: "Get current weather for a location",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    },
  },
];

const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools,
  messages,
});

// Handle tool use
if (response.stop_reason === "tool_use") {
  const toolUse = response.content.find((b) => b.type === "tool_use");
  // Execute tool, add result to messages, loop
}
```

## Streaming

```typescript
const stream = await client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
const finalMessage = await stream.finalMessage();
```

## Extended Thinking

```typescript
const response = await client.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 16000,
  thinking: { type: "enabled", budget_tokens: 10000 },
  messages: [{ role: "user", content: complexProblem }],
});

const thinkingBlock = response.content.find((b) => b.type === "thinking");
const textBlock = response.content.find((b) => b.type === "text");
```

## Error Handling

```typescript
import { APIError, RateLimitError, AuthenticationError } from "@anthropic-ai/sdk";

try {
  const response = await client.messages.create({...});
} catch (error) {
  if (error instanceof RateLimitError) {
    // Retry with exponential backoff
  } else if (error instanceof AuthenticationError) {
    // Invalid API key — do not retry
  } else if (error instanceof APIError) {
    console.error(`API error ${error.status}: ${error.message}`);
  }
}
```

## Behavior

1. Import from `@anthropic-ai/sdk` (TypeScript) or `anthropic` (Python).
2. Instantiate client once at module level, not per-request.
3. Add `cache_control` to system prompts ≥1024 tokens.
4. Use the current model IDs listed above — reject outdated `claude-3-*` IDs.
5. Stream when response will be displayed incrementally to a user.
6. Handle rate limits with exponential backoff (start at 1s, max 64s, max 5 retries).
7. Never log full API responses containing user data in production.

## Rules

- MUST add prompt caching to any production API call with a system prompt ≥1024 tokens.
- MUST use current model IDs — update `claude-3-*` references to the table above.
- MUST handle `RateLimitError` with backoff.
- MUST NOT hardcode API keys — use `process.env.ANTHROPIC_API_KEY`.
- MUST NOT instantiate the client inside a request handler or loop.
- MUST NOT log full message content in production.

## Notes

- API keys: never commit. Always `process.env.ANTHROPIC_API_KEY` or equivalent secret manager.
- Batch API: use for offline, non-interactive workloads (>100 messages). 50% cost reduction.
- Files API: upload large documents once, reference by file_id in subsequent calls.
- Related skills: `security-review` (prompt injection defense), `tdd-workflow` (test LLM integrations with recorded fixtures).
