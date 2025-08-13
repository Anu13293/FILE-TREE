import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  qid: { type: String, required: true },
  value: mongoose.Schema.Types.Mixed // string | [string] | text
});

const ResponseSchema = new mongoose.Schema(
  {
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    respondentId: { type: String }, // optional (device id / session id)
    answers: [AnswerSchema],
    meta: {
      userAgent: String,
      ip: String,
      location: { lat: Number, lng: Number }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Response', ResponseSchema);
