import { Request, Response } from 'express';
import { catchAsync } from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import status from 'http-status';
import { SummaryServices } from './summary.service';

const generateSummary = catchAsync(async (req: Request, res: Response) => {
  const { originalText, prompt } = req.body;
  const userId = req.user?._id;

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
  const result = await SummaryServices.getUserSummaries(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User summaries retrieved successfully',
    data: result,
  });
});

export const updateSummary = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { summary: updatedText } = req.body;
  const userId = req.user?._id;
  const userRole = req.user?.role;

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

  await SummaryServices.deleteSummary(userId, id, userRole);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Summary deleted successfully',
    data: null,
  });
});


export const SummaryController ={
    getUserSummaries,
    generateSummary,
    updateSummary,
    deleteSummary
}