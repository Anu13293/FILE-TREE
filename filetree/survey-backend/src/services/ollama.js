import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

/**
 * Generate an image with an image-capable Ollama model (e.g., flux).
 * IMPORTANT: Your Ollama build/model must support image outputs.
 * Many setups return: { "images": ["<base64>"] } when stream:false.
 */
export async function ollamaGenerateImage({ model, prompt }) {
  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama error: ${res.status} ${txt}`);
  }

  const data = await res.json();

  // Expected shape for image-capable models:
  // { images: ["<base64png>"] } OR { response: "<base64>" } depending on model
  if (data.images && data.images.length > 0) {
    return data.images[0];
  }

  // If your model returns a single base64 string in "response":
  if (data.response && /^[A-Za-z0-9+/=]+$/.test(data.response.trim())) {
    return data.response.trim();
  }

  throw new Error('Ollama did not return an image payload. Check model compatibility.');
}
