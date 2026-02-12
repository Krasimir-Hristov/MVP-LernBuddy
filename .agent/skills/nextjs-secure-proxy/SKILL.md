---
name: Next.js 16 App Router & Secure Proxy
description: Best practices for Next.js 16 App Router and secure API proxy implementation.
---

# Next.js 16 App Router & Secure Proxy Pattern

## Overview

This skill outlines the modern approach to building secure, scalable applications with Next.js 16 App Router. It focuses on the "Proxy Pattern" where sensitive API calls (e.g., to AI services or databases) are handled exclusively on the server to protect API keys.

## Key Concepts

### 1. App Router Structure

- Use `app/layout.tsx` for global layouts.
- Use `app/page.tsx` for route pages.
- Use `app/api/.../route.ts` for API Route Handlers (Back-end logic).

### 2. Secure API Proxy Pattern

To protect sensitive keys (like Supabase Service Role Key or Gemini API Key), never expose them to the client. Instead, create a Route Handler that acts as a proxy.

**Example Structure:** `app/api/proxy/gemini/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with server-side ONLY environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt, history } = await request.json();

    // Validate request (e.g., check session, rate limits)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
```

### 3. Server Actions vs Route Handlers

- **Server Actions:** Best for form submissions and mutations that redirect or revalidate data.
- **Route Handlers:** Best for serving standard JSON APIs, webhooks, or acting as a proxy for external services where you need fine-grained control over the request/response (streaming, headers, etc.).

### 4. Middleware

Use `middleware.ts` for authentication checks and protecting routes, but keep business logic in Route Handlers or Server Components.
