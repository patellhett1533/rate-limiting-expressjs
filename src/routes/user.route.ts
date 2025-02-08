import express from "express";
import validate from "../middlewares/validate";
import { userController } from "../controllers/user.controller";
import userValidation from "../validators/user.validate";
import auth from "../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  validate(userValidation.registerUser),
  userController.createUser
);

router.post(
  "/login",
  validate(userValidation.loginUserByPassword),
  userController.loginUser
);

router.post(
  "/refresh-auth",
  validate(userValidation.refreshUserToken),
  userController.refreshUserToken
);

router.get(
  "/:userId",
  auth(),
  validate(userValidation.getUserById),
  userController.getUserById
);

export default router;
