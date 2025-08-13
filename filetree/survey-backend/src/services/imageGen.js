import { v4 as uuid } from 'uuid';
import { saveBase64Image } from '../utils/fs.js';
import { ollamaGenerateImage } from './ollama.js';
import dotenv from 'dotenv';
dotenv.config();

const IMAGE_MODEL = process.env.OLLAMA_IMAGE_MODEL || 'flux';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

export async function generateOptionImage(questionText, optionLabel) {
  // Craft a safe, descriptive prompt for the option
  const prompt = `
Create a simple, flat illustration (PNG) that represents the survey option:
- Question: "${questionText}"
- Option: "${optionLabel}"
- Style: clean iconographic, high contrast, centered subject, no text.
`.trim();

  const b64 = await ollamaGenerateImage({ model: IMAGE_MODEL, prompt });
  const filename = `${uuid()}.png`;
  const absPath = saveBase64Image(b64, filename);
  // Return a public URL for the frontend
  return `${BASE_URL}/images/${filename}`;
}
