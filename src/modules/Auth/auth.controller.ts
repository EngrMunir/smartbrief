import status from 'http-status';
import sendResponse from '../../app/utils/sendResponse';
import config from '../../app/config';
import { catchAsync } from '../../app/utils/catchAsync';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
const result = await AuthService.loginUser(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: { accessToken },
  });
});

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);  
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User is registered successfully!',
    data: result,
  });
});


const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: 'Refresh token not found',
      data: null,
    });
  }
  await AuthService.logoutUser(refreshToken);

  res.clearCookie('refreshToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged out successfully!',
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
};