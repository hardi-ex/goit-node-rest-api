import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUser } from "../services/authServices.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    next(HttpError(401, "Not authorized: Authorization header not found"));

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer")
    next(HttpError(401, "Not authorized: Bearer not found"));

  const { data, error } = verifyToken(token);

  if (error) next(HttpError(401, "Not authorized: invalid token"));

  const { id } = data;
  const user = await findUser({ _id: id });

  if (!user) next(HttpError(401, "Not authorized: user not found"));

  if (!user.token) {
    return next(HttpError(401, "Not authorized"));
  }

  req.user = user;
  next();
};

export default authenticate;
