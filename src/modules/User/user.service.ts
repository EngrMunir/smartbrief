import status from 'http-status';
import { User } from './user.model';
import AppError from '../../app/errors/AppError';

const getSingleUserFromDB = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail });

  if (!result) throw new AppError(status.NOT_FOUND, 'User not found');

  return result;
};

const getAllUsersFromDB = async () => {
 
    const result = await User.find();

  return { result };
};


export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB
};