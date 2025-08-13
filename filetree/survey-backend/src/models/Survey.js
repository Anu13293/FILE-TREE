import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  key: { type: String, required: true },       // e.g., 'A', 'B', 'yes', 'no'
  label: { type: String, required: true },     // option label
  imageUrl: { type: String }                   // populated after generation
});

const QuestionSchema = new mongoose.Schema({
  qid: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['single', 'multi', 'text'], default: 'single' },
  options: [OptionSchema]
});

const SurveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    locale: { type: String, default: 'en' },
    questions: [QuestionSchema],
    status: { type: String, enum: ['draft', 'live', 'closed'], default: 'draft' }
  },
  { timestamps: true }
);

export default mongoose.model('Survey', SurveySchema);
