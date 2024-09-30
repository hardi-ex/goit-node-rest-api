import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import { createToken } from "../helpers/jwt.js";
import { v4 as uuid } from "uuid";
import sendEmail from "../helpers/sendEmail.js";

import gravatar from "gravatar";

export const findUser = (filter) => User.findOne(filter);
export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const createVerifyEmail = (email, verificationToken) => {
  return {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: "Verify email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };
};

export const signup = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(email, {
    rating: "g",
    default: "retro",
    protocol: "https",
  });
  const verificationToken = uuid();

  const newUser = User.create({
    ...data,
    password: hashPassword,
    avatarURL: avatar,
    verificationToken,
  });

  const msg = createVerifyEmail(email, verificationToken);

  sendEmail(msg);

  return newUser;
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );
};

export const reVerifyEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const msg = createVerifyEmail(email, user.verificationToken);

  sendEmail(msg);
};

export const signIn = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = createToken(payload);
  await updateUser({ _id: user._id }, { token });

  return { token, user };
};
