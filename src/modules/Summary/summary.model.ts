import { Schema, model } from 'mongoose';
import { ISummary } from './summary.interface';

const summarySchema = new Schema<ISummary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalText: { type: String, required: true },
    summary: { type: String, required: true },
    prompt: { type: String },
    wordCount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Summary = model<ISummary>('Summary', summarySchema);