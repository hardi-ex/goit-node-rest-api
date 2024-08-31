import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";

export const register = ctrlWrapper(async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    subscription: newUser.subscription,
    email: newUser.email,
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { token, user } = await authServices.signIn(req.body);

  res.json({
    token,
    user: {
      subscription: user.subscription,
      email: user.email,
    },
  });
});

export const getCurrent = ctrlWrapper((req, res) => {
  const { subscription, email } = req.user;

  res.json({
    subscription,
    email,
  });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).json();
});

export const updSubscription = ctrlWrapper(async (req, res) => {
  const { subscription } = req.body;

  const updatedUser = await authServices.updateUser(
    { _id: req.user.id },
    { subscription }
  );

  if (!updatedUser) throw HttpError(404, "User not found");

  res.json(updatedUser);
});
