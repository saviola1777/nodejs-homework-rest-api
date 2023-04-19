const { Contact } = require("../models/contact")

const { controllerWrapper } = require("../uttils/index")

const HttpError = require("../helpers/httpError")

const getAllContacts = async (req, res) => {
  const result = await Contact.find()
  res.json(result)
}

const getContactsById = async (req, res) => {
  const { id } = req.params
  const result = await Contact.findById(id)
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
}

const addContacts = async (req, res) => {

  const result = await Contact.create(req.body)
  res.status(201).json(result)
}

const updateContacById = async (req, res) => {

  const { id } = req.params
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
}

const updateFavoriteById = async (req, res) => {

  const { id } = req.params
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
}

const deleteContacts = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id)
    if (!result) {
      throw HttpError(404)
    }
    res.json({ message: "contact deleted" })
}

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getContactsById: controllerWrapper(getContactsById),
  addContacts: controllerWrapper(addContacts),
  updateContacById: controllerWrapper(updateContacById),
  updateFavoriteById: controllerWrapper(updateFavoriteById),
  deleteContacts: controllerWrapper(deleteContacts),
}