const fs = require("fs/promises")
const path = require("path")
const uniqid = require("uniqid");

const pathContacts = path.join(__dirname, "./contacts.json")


const listContacts = async () => {
  const data = await fs.readFile(pathContacts, "utf-8")
  return JSON.parse(data)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const result = contacts.find(({ id }) => id === contactId)
  return result || null
}

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  console.log(contacts)
  const findContactOnNumber = contacts.find((contact) => contact.phone === phone);
  if (findContactOnNumber) return;

  const newContact = {
    id: uniqid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact)
  await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2))
  return newContact
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId)
  if (index === -1) return null;

  const [result] = contacts.splice(index, 1)
  await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2))
  return result
}

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id)
  if (index === -1) return null;

  contacts[index] = { id, ...body }
  await fs.writeFile(pathContacts, JSON.stringify(contacts, null, 2))
  return contacts[index]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
