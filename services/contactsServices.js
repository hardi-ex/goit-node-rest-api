import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const addContact = async (name, email, phone) =>
  Contact.create(name, email, phone);

export const updContact = async (contactId, dataContact) =>
  Contact.findByIdAndUpdate(contactId, dataContact);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);
