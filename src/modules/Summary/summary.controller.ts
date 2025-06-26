import { Request, Response } from 'express';
import { catchAsync } from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import status from 'http-status';
import { SummaryServices } from './summary.service';
import fs from 'fs';
import { readTxtOrDocx } from '../../app/utils/readTxtOrDocx';
import path from "path";
import mammoth from 'mammoth';
import { unlink } from 'fs/promises';


const generateSummary = catchAsync(async (req: Request, res: Response) => {
  const { originalText, prompt } = req.body;
  const userId = req.user?._id;
if (!userId) throw new Error("User ID is required");
  const result = await SummaryServices.generateSummary(userId, originalText, prompt);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary generated successfully',
    data: result,
  });
});

const getUserSummaries = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new Error("User ID is required");
  const result = await SummaryServices.getUserSummaries(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User summaries retrieved successfully',
    data: result,
  });
});

const getAllSummaries = catchAsync(async (req: Request, res: Response) => {
  const result = await SummaryServices.getAllSummaries();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All summaries retrieved successfully',
    data: result,
  });
});


export const updateSummary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { summary: updatedText } = req.body;
  const userId = req.user?._id;
  const userRole = req.user?.role;
if (!userId) throw new Error("User ID is required");
if (!userRole) throw new Error("User Role is required");
  const result = await SummaryServices.updateSummary(userId, id, updatedText, userRole);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary updated successfully',
    data: result,
  });
});

export const deleteSummary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const userRole = req.user?.role;
  if (!userId) throw new Error("User ID is required");
  if (!userRole) throw new Error("User Role is required");
  await SummaryServices.deleteSummary(userId, id, userRole);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary deleted successfully',
    data: null,
  });
});

const generateSummaryFromFile = catchAsync(async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  const userId = req.user?._id;
  const prompt = req.body.prompt;

  if (!filePath) {
    return res.status(400).json({ message: 'File not uploaded' });
  }

  const originalText = await readTxtOrDocx(filePath);
  if (!userId) throw new Error("User ID is required");
  const result = await SummaryServices.generateSummary(userId, originalText, prompt);

  await unlink(filePath); // delete file after processing

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary generated from file successfully',
    data: result,
  });
});

const uploadAndGenerateSummary = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const userId = req.user?._id;
  const prompt = req.body.prompt;

  if (!file) throw new Error('No file uploaded');

  const ext = path.extname(file.originalname).toLowerCase();
  let originalText = '';

  if (ext === '.txt') {
    originalText = fs.readFileSync(file.path, 'utf-8');
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: file.path });
    originalText = result.value;
  } else {
    throw new Error('Unsupported file type');
  }
if (!userId) throw new Error("User ID is required");
  const summary = await SummaryServices.generateSummary(userId, originalText, prompt);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary generated from uploaded file',
    data: summary,
  });
});

export const repromptSummary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prompt } = req.body;
  const userId = req.user?._id;
if (!userId) throw new Error("User ID is required");
  const result = await SummaryServices.repromptSummary(userId, id, prompt);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary regenerated successfully',
    data: result,
  });
});


export const SummaryController ={
    getUserSummaries,
    getAllSummaries,
    generateSummary,
    updateSummary,
    deleteSummary,
    generateSummaryFromFile,
    uploadAndGenerateSummary,
    repromptSummary,
}