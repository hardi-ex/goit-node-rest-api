import express from "express";
import isValidId from "../middlewares/isValidId.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const createMiddleware = validateBody(createContactSchema);
const updateMiddleware = validateBody(updateContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", createMiddleware, createContact);

contactsRouter.put("/:id", isValidId, updateMiddleware, updateContact);

contactsRouter.patch("/:id/favorite", isValidId, updateStatusContact);

export default contactsRouter;
