const { Contact } = require("../models/contact")

const { controllerWrapper } = require("../uttils/index")

const HttpError = require("../helpers/httpError")

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 10 } = req.query
  console.log(req.query)
  const skip = (page - 1) * limit
  const result = await Contact.find({ owner }, "", { skip, limit }).populate("owner", "name email")
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
  const { _id: owner } = req.user
  const result = await Contact.create({ ...req.body, owner })
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