import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { createApiError } from "../utils/createApiError";
import notificationService from "../services/notification.service";

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = req.body;
  await notificationService.sendNotification(notification);
  res.status(httpStatus.CREATED).send({ notification });
});

export default { createNotification };
