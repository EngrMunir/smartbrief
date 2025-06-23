import { Response } from 'express';

const sendResponse = (res: Response, data:any) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;