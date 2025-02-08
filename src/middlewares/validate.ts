import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import httpStatus from "http-status";
import { pick } from "../utils/pick";
import { createApiError } from "../utils/createApiError";
import { ValidationSchema } from "../interfaces/common.interface";
import logger from "../config/logger";

const validate =
  (schema: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body", "file"]);
    const object = pick(
      req,
      Object.keys(validSchema) as (keyof ValidationSchema)[]
    );

    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      logger.error(errorMessage);
      return next(createApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    const { value: validatedValue } = value;
    Object.assign(req, validatedValue);

    next();
  };

export default validate;
