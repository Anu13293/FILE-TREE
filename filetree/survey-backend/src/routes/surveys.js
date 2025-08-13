import express from 'express';
import { z } from 'zod';
import Survey from '../models/Survey.js';
import { generateOptionImage } from '../services/imageGen.js';

const router = express.Router();

const OptionSchema = z.object({
  key: z.string(),
  label: z.string()
});
const QuestionSchema = z.object({
  qid: z.string(),
  text: z.string(),
  type: z.enum(['single', 'multi', 'text']).default('single'),
  options: z.array(OptionSchema).optional().default([])
});
const SurveySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  locale: z.string().optional(),
  questions: z.array(QuestionSchema)
});

/**
 * POST /api/surveys
 * Input: survey JSON
 * Action: analyze questions & options, generate images for options, store and return survey with image URLs
 */
router.post('/', async (req, res, next) => {
  try {
    const payload = SurveySchema.parse(req.body);

    // Generate images for each option
    for (const q of payload.questions) {
      if (q.options && q.options.length > 0) {
        const promises = q.options.map(async (opt) => {
          const url = await generateOptionImage(q.text, opt.label);
          return { ...opt, imageUrl: url };
        });
        q.options = await Promise.all(promises);
      }
    }

    const survey = await Survey.create({
      ...payload,
      status: 'live' // set live on creation; adjust if needed
    });

    res.status(201).json(survey);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/surveys/:id
 * Return survey (includes option image urls)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/surveys/:id/status
 * Update status (draft/live/closed)
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    next(err);
  }
});

export default router;
