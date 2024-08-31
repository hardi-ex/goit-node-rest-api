import express from "express";
import {
  getCurrent,
  login,
  logout,
  register,
  updSubscription,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignInSchema, userSignupSchema } from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const registerMiddleware = validateBody(userSignupSchema);
const loginMiddleware = validateBody(userSignInSchema);

const authRouter = express.Router();

authRouter.post("/register", registerMiddleware, register);
authRouter.post("/login", loginMiddleware, login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/", authenticate, updSubscription);

export default authRouter;
