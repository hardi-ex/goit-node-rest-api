import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Jimp } from "jimp";

const avatarsPath = path.resolve("public", "avatars");

export const register = ctrlWrapper(async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    subscription: newUser.subscription,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
    verificationToken: newUser.verificationToken,
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

export const updAvatar = ctrlWrapper(async (req, res) => {
  if (!req.file) throw HttpError(404, "File not found!");

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);

  const image = await Jimp.read(newPath);
  image.cover({ w: 250, h: 250 });
  image.write(newPath);

  const avatar = path.join("/avatars", filename);

  const updatedUser = await authServices.updateUser(
    { _id: req.user.id },
    { avatarURL: avatar }
  );

  res.json({
    message: "Avatar updated successfully",
    user: {
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
    },
  });
});

export const verify = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  await authServices.verifyUser(verificationToken);
  res.json({
    message: "Email verified successfully",
  });
});
export const reVerify = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  await authServices.reVerifyEmail(email);
  res.json({
    message: "Verification email sent",
  });
});
