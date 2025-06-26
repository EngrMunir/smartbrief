import { Request, Response } from 'express';
import status from 'http-status';
import { UserServices } from './user.service';
import { catchAsync } from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

// const getSingleUser = catchAsync(async (req: Request, res: Response) => {
//   const { userEmail } = req.params;

//   const result = await UserServices.getSingleUserFromDB(userEmail);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: 'User retrieved successfully',
//     data: result,
//   });
// });

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});


const rechargeCredits = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?._id;
  const userRole = req.user?.role;

  if (userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admin can recharge credits' });
  }

  const { userId, amount } = req.body;
  const result = await UserServices.rechargeCredits(userId, amount);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Credits recharged successfully',
    data: result,
  });
});

const getMyProfile = async (req: Request, res: Response) => {
  const email = req.user?.email;
  if (!email) throw new Error("User ID is required");
  const result = await UserServices.getSingleUserFromDB(email);
  console.log('result',result);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
};




export const UserController = {
  getAllUsers,
  rechargeCredits,
  getMyProfile
};
