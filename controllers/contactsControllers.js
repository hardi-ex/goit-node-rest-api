import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const result = await contactsService.listContacts(filter, { skip, limit });

  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getOneContact({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.removeContact({ _id: id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;
  const result = await contactsService.addContact(name, email, phone, owner);

  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.updContact({ _id: id, owner }, req.body);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { favorite = false } = req.body;

  const result = await contactsService.updContact(
    { _id: id, owner },
    { favorite }
  );

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
});
