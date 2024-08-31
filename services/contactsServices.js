import Contact from "../models/Contact.js";

export const listContacts = (filter, settings) =>
  Contact.find(filter, "-createdAt -updatedAt", settings).populate(
    "owner",
    "email subscription"
  );

export const getOneContact = (filter) => Contact.findOne(filter);

export const addContact = (name, email, phone, owner) =>
  Contact.create({ name, email, phone, owner });

export const updContact = (filter, dataContact) =>
  Contact.findOneAndUpdate(filter, dataContact);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);
