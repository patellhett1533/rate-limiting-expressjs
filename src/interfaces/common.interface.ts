import Joi from "joi";
import mongoose from "mongoose";

export interface ImageDB {
  url: string;
  width: number;
  height: number;
  alt?: string;
  title?: string;
}

export interface VideoDB {
  url: string;
  width: number;
  height: number;
  duration: number;
}

export interface UserTypes {
  id?: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserUpdateTypes {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
}

export interface NodeTypes {
  type: string;
  data: {
    text: string;
    action: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface EdgeTypes {
  source: mongoose.Schema.Types.ObjectId;
  target: mongoose.Schema.Types.ObjectId;
}

export interface FlowTypes {
  name: string;
  user_id: mongoose.Schema.Types.ObjectId;
}

export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationSchema {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
  file?: Joi.Schema;
}

export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
