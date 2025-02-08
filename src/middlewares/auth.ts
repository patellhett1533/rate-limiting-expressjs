import { Request, Response, NextFunction } from "express";
import passport from "passport";
import httpStatus from "http-status";
import { createApiError } from "../utils/createApiError";
import { UserTypes } from "../interfaces/common.interface";
import isTokenValid from "../utils/tokenVerification";
import userService from "../services/user.service";
import env from "../config/env";

const verifyCallback =
  (
    req: Request,
    resolve: (value?: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
  ) =>
  (err: string, user: UserTypes, info: string) => {
    if (err || info || !user) {
      return reject(createApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
    }
    req.user = user;
    resolve();
  };

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken || isTokenValid(accessToken)) {
      req.headers.authorization = `Bearer ${accessToken}`;
    }

    if (!accessToken || !isTokenValid(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken || refreshToken === "undefined" || !isTokenValid(refreshToken)) {
        throw createApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
      }
      const { access, refresh } = await userService.refreshAuthUser(refreshToken);
      res.cookie("accessToken", access.token, {
        httpOnly: true,
        sameSite: env.env === "production" ? "none" : "strict",
        secure: env.env === "production",
        maxAge: access.expires.getTime() - Date.now(),
      });
      res.cookie("refreshToken", refresh.token, {
        httpOnly: true,
        sameSite: env.env === "production" ? "none" : "strict",
        secure: env.env === "production",
        maxAge: refresh.expires.getTime() - Date.now(),
      });

      req.headers.authorization = `Bearer ${access.token}`;
    }
    await new Promise<void>((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject))(
        req,
        res,
        next,
      );
    });
    next();
  } catch (err) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: "Please authenticate",
    });
  }
};

export default auth;
