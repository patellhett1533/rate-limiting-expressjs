import Joi from "joi";
import { ValidationSchema } from "../interfaces/common.interface";

const registerUser: ValidationSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const loginUserByPassword: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const logoutUser: ValidationSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const refreshUserToken: ValidationSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const getUserById: ValidationSchema = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

export default {
  registerUser,
  loginUserByPassword,
  logoutUser,
  refreshUserToken,
  getUserById,
};
