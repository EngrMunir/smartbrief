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


const rechargeCredits = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');

  user.credits += amount;
  await user.save();

  return { userId: user._id, newCredits: user.credits };
};


export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  rechargeCredits
};