import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = ctrlWrapper(async (_, res) => {
  const result = await contactsService.listContacts();

  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.removeContact(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const result = await contactsService.addContact(name, email, phone);

  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await contactsService.updContact(id, req.body);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { favorite = false } = req.body;

  const result = await contactsService.updContact(id, { favorite });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
});
