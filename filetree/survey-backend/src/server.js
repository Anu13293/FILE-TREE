import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import './config/db.js';
import surveyRoutes from './routes/surveys.js';
import responseRoutes from './routes/responses.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Serve generated images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);

// Health
app.get('/health', (_, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on :${port}`));
