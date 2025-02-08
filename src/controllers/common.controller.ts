import { Request, Response } from "express";
import logger from "../config/logger";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

const addSingleFile = catchAsync(async (req: Request, res: Response) => {
  try {
    const file = req.file;
    res.status(httpStatus.OK).send({ file: file?.filename });
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
});

export default { addSingleFile };
