import { Document, Types } from 'mongoose';

export interface ISummary extends Document {
  user: Types.ObjectId;
  originalText: string;
  summary: string;
  prompt?: string;
  wordCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}