import httpStatus from "http-status";
import { UserTypes, UserUpdateTypes } from "../interfaces/common.interface";
import User from "../models/user.model";
import { createApiError } from "../utils/createApiError";
import QueryString from "qs";
import Token from "../models/token.model";
import tokenTypes from "../config/tokens";
import tokenService from "./token.service";

const createUser = async (user: UserTypes) => {
  if (await User.isEmailTaken(user.email)) {
    throw createApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return await User.create(user);
};

const queryUsers = async (
  filter: Pick<QueryString.ParsedQs, "name">,
  options: Pick<QueryString.ParsedQs, "sortBy" | "limit" | "page" | "search">
) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw createApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const updateUser = async (id: string, user: UserUpdateTypes) => {
  const existingUser = await getUserById(id);
  return await existingUser.updateOne(user);
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

const loginUser = async (userBody: { email: string; password: string }) => {
  const user = await getUserByEmail(userBody.email);
  if (!user) {
    throw createApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  const isPasswordValid = await user.matchPassword(userBody.password);
  if (!isPasswordValid) {
    throw createApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  return user;
};

const logoutUser = async (refreshToken: string) => {
  const token = await Token.findOneAndDelete({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!token) {
    throw createApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
  return token;
};

const refreshAuthUser = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw createApiError(httpStatus.NOT_FOUND, "No user found");
    }
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    throw createApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshAuthUser,
};
