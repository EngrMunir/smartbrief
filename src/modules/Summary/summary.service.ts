import { ISummary } from './summary.interface';
import config from '../../app/config';
import { User } from '../User/user.model';
import AppError from '../../app/errors/AppError';
import status from 'http-status';
import { Summary } from './summary.model';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(config.gemini_api_key);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const generateSummary = async (
  userId: string,
  originalText: string,
  prompt?: string
): Promise<ISummary> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');
  if (user.credits <= 0) throw new AppError(status.BAD_REQUEST, 'Insufficient credits');

  const fullPrompt = prompt || 'Summarize this content in 3-5 lines:';
  const inputText = `${fullPrompt}\n\n${originalText}`;

  // 👇 This part MUST be correct
  const result = await model.generateContent([inputText]);
  const response = await result.response;
  const summaryText = response.text() || 'Summary not available.';
  const wordCount = summaryText.split(' ').length;

  const saved = await Summary.create({
    user: user._id,
    originalText,
    summary: summaryText,
    prompt: fullPrompt,
    wordCount,
  });

  user.credits -= 1;
  await user.save();

  return saved;
};

const getUserSummaries = async (userId: string): Promise<ISummary[]> => {
  return Summary.find({ user: userId }).sort({ createdAt: -1 });
};

const updateSummary = async (
  userId: string,
  summaryId: string,
  updatedText: string,
  userRole: string
): Promise<ISummary> => {
  const summary = await Summary.findById(summaryId);
  if (!summary) throw new AppError(status.NOT_FOUND, 'Summary not found');

  if (userRole !== 'editor' && summary.user.toString() !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not allowed to edit this summary');
  }

  summary.summary = updatedText;
  summary.wordCount = updatedText.split(' ').length;
  await summary.save();

  return summary;
};

const deleteSummary = async (
  userId: string,
  summaryId: string,
  userRole: string
): Promise<void> => {
  const summary = await Summary.findById(summaryId);
  if (!summary) throw new AppError(status.NOT_FOUND, 'Summary not found');

  if (userRole !== 'editor' && summary.user.toString() !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not allowed to delete this summary');
  }

  await Summary.findByIdAndDelete(summaryId);
};

export const SummaryServices = {
  generateSummary,
  getUserSummaries,
  updateSummary,
  deleteSummary,
};
