import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");

const updJSON = (item) =>
  fs.writeFile(contactsPath, JSON.stringify(item, null, 2));

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const data = contacts.find((contact) => contact.id === contactId);
  return data || null;
};

export const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await updJSON(contacts);

  return newContact || null;
};

export const updContact = async (contactId, dataContact) => {
  const contacts = await listContacts();
  const dataIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (dataIndex === -1) return null;

  contacts[dataIndex] = { ...contacts[dataIndex], ...dataContact };
  await updJSON(contacts);

  return contacts[dataIndex];
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const dataIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (dataIndex === -1) return null;

  const [data] = contacts.splice(dataIndex, 1);

  await updJSON(contacts);

  return data;
};
