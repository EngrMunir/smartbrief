import { Request, Response } from 'express';
import status from 'http-status';
import { UserServices } from './user.service';
import { catchAsync } from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { userEmail } = req.params;

  const result = await UserServices.getSingleUserFromDB(userEmail);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});


export const UserController = {
  getSingleUser,
  getAllUsers,
};
