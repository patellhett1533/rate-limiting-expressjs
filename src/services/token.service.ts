import moment from "moment";
import env from "../config/env";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import Token from "../models/token.model";
import { createApiError } from "../utils/createApiError";
import tokenTypes from "../config/tokens";

const generateToken = (
  user: string,
  expires: moment.Moment,
  type: string,
  secret: string = env.jwt.secret
) => {
  const payload = {
    sub: user,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  user: string,
  expires: moment.Moment,
  type: string,
  blacklisted: boolean = false
) => {
  const tokenDoc = await Token.create({
    token,
    user,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, env.jwt.secret);
  const tokenDoc = await Token.findOneAndDelete({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw createApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: string) => {
  const accessTokenExpires = moment().add(env.jwt.accessExpirationMinutes, "minutes");
  const refreshTokenExpires = moment().add(
    env.jwt.refreshExpirationDays,
    "days"
  );
  const accessToken = generateToken(
    user,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  await saveToken(accessToken, user, accessTokenExpires, tokenTypes.ACCESS);
  const refreshToken = generateToken(
    user,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(refreshToken, user, refreshTokenExpires, tokenTypes.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (user: string) => {
  const expires = moment().add(
    env.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(resetPasswordToken, user, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: string) => {
  const expires = moment().add(env.jwt.verifyEmailExpirationMinutes, "minutes");
  const verifyEmailToken = generateToken(
    user,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  verifyToken,
  generateToken,
  saveToken,
};
