import express from "express";
import commonController from "../controllers/common.controller";
import upload from "../utils/multer";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/upload-single", auth(), upload.single("file"), commonController.addSingleFile);

export default router;
