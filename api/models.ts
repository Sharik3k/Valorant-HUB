import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function для отримання списку моделей OpenRouter
 */

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Дозволити тільки GET запити
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // API ключ береться з змінних оточення СЕРВЕРУ
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("⚠️ OPENROUTER_API_KEY not set in environment variables");
      return res.status(500).json({
        error: "Server configuration error: API key not configured",
      });
    }

    const response = await fetch(OPENROUTER_MODELS_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch models: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
