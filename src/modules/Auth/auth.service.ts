import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TLoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";
import { User } from "../User/user.model";
import AppError from "../../app/errors/AppError";
import config from "../../app/config";
import { IUser } from "../User/user.interface";

// Register user
const registerUser = async (payload: IUser) => {
  const user = await User.isUserExistByEmail(payload?.email);
  console.log('user')
  if (user) throw new AppError(status.CONFLICT, 'User already exists!');

  // Provide default credits
  payload.credits = 5;

  const result = await User.create(payload);
  return result;
};

// Login user
const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistByEmail(payload?.email);
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found!');

  const isPasswordCorrect = await User.isPasswordMatched(
    payload?.password,
    user?.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(status.FORBIDDEN, 'Password not match!');
  }

  const jwtPayload = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    _id: user?._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string
  );

  // ✅ Save refresh token in DB
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return {
    accessToken,
    refreshToken,
  };
};

// Refresh token logic
const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  const user = await User.isUserExistByEmail(email);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'This user is not found!');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string
  );

  return {
    accessToken,
  };
};

// Logout user and clear refreshToken
const logoutUser = async (refreshToken: string) => {
  const result = await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null },
    { new: true }
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'User not found during logout.');
  }

  return result;
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
