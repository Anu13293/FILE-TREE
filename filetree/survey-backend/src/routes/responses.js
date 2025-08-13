import express from 'express';
import { z } from 'zod';
import Response from '../models/response.js';
import Survey from '../models/Survey.js';

const router = express.Router();

const AnswerSchema = z.object({
  qid: z.string(),
  value: z.any()
});

const SubmitSchema = z.object({
  surveyId: z.string(),
  respondentId: z.string().optional(),
  answers: z.array(AnswerSchema),
  meta: z
    .object({
      userAgent: z.string().optional(),
      ip: z.string().optional(),
      location: z.object({ lat: z.number(), lng: z.number() }).optional()
    })
    .optional()
});

/**
 * POST /api/responses/submit
 * Submit user answers
 */
router.post('/submit', async (req, res, next) => {
  try {
    const body = SubmitSchema.parse(req.body);
    const survey = await Survey.findById(body.surveyId);
    if (!survey || survey.status !== 'live') {
      return res.status(400).json({ message: 'Survey not found or not live' });
    }

    const saved = await Response.create({
      surveyId: body.surveyId,
      respondentId: body.respondentId,
      answers: body.answers,
      meta: body.meta || {}
    });

    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/responses/:surveyId
 * Admin review: list responses for a survey
 */
router.get('/:surveyId', async (req, res, next) => {
  try {
    const list = await Response.find({ surveyId: req.params.surveyId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
