const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const { SECRET_KEY } = process.env

const { controllerWrapper } = require("../uttils/index")

const { User } = require("../models/user")

const HttpError = require("../helpers/httpError")

const register = async (req, res) => {
   const { password, email } = req.body;
   const user = await User.findOne({ email })
   if (user) { throw HttpError(409, "Email in use") }
   const hashPassword = await bcrypt.hash(password, 10)
   const resault = await User.create({ ...req.body, password: hashPassword })
   res.status(201).json({
      name: resault.name,
      email: resault.email,
   })
}

const login = async (req, res) => {
   const { password, email } = req.body;
   const user = await User.findOne({ email })
   if (!user) { throw HttpError(401, "Email or password is wrong") }
   const passwordCompare = await bcrypt.compare(password, user.password)
   if (!passwordCompare) { throw HttpError(401, "Email or password is wrong") }
   const payload = ({ id: user._id })
   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
   await User.findByIdAndUpdate(user._id, { token })
   res.json({ token })
}

const getCurrent = async (req, res) => {
   const { name, email } = req.user
   res.json({
      name,
      email,
   })
}

const logout = async (req, res) => {
   const { _id } = req.user
   await User.findByIdAndUpdate(_id, { token: "" })
   res.json({
      message: "logout success"
   })


}

module.exports = {
   register: controllerWrapper(register),
   login: controllerWrapper(login),
   getCurrent: controllerWrapper(getCurrent),
   logout: controllerWrapper(logout),
}