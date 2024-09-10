import express from "express";
import {
  getCurrent,
  login,
  logout,
  register,
  updAvatar,
  updSubscription,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignInSchema, userSignupSchema } from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const registerMiddleware = validateBody(userSignupSchema);
const loginMiddleware = validateBody(userSignInSchema);
const updAvatarMiddleware = upload.single("avatar");

const authRouter = express.Router();

authRouter.post("/register", registerMiddleware, register);
authRouter.post("/login", loginMiddleware, login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/", authenticate, updSubscription);
authRouter.patch("/avatars", authenticate, updAvatarMiddleware, updAvatar);

export default authRouter;
