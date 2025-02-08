import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { createApiError } from "../utils/createApiError";
import userService from "./../services/user.service";
import tokenService from "../services/token.service";
import env from "../config/env";
import notificationService from "../services/notification.service";
import logger from "../config/logger";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateAuthTokens(user.id);
  logger.info(user);
  const notification = await notificationService.sendNotification({
    message: "Welcome to the app",
    priority: "high",
    send_time: new Date(),
  });
  res.status(httpStatus.CREATED).send({ user, token });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw createApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.status(httpStatus.OK).send(user);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = await userService.loginUser(req.body);
    const token = await tokenService.generateAuthTokens(user.id);
    res.cookie("accessToken", token.access.token, {
      httpOnly: true,
      sameSite: env.env === "production" ? "none" : "strict",
      secure: env.env === "production",
      maxAge: token.access.expires.getTime() - Date.now(),
    });
    res.cookie("refreshToken", token.refresh.token, {
      httpOnly: true,
      sameSite: env.env === "production" ? "none" : "strict",
      secure: env.env === "production",
      maxAge: token.refresh.expires.getTime() - Date.now(),
    });
    res.status(httpStatus.OK).send({ user, token });
  } catch {
    res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  await userService.logoutUser(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshUserToken = catchAsync(async (req: Request, res: Response) => {
  const tokens = await userService.refreshAuthUser(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

export const userController = {
  createUser,
  getUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
};
