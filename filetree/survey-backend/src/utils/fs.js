import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.join(__dirname, '../../public/images');

export function ensureImagesDir() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  return IMAGES_DIR;
}

export function saveBase64Image(b64, filename) {
  const dir = ensureImagesDir();
  const filePath = path.join(dir, filename);
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
