const bcrypt = require("bcryptjs")
const gravatar = require("gravatar")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const path = require("path")
const uniqid = require("uniqid")

const { SECRET_KEY, BASE_URL } = process.env

const { controllerWrapper } = require("../uttils/index")
const ImageSize = require("../helpers/imageSize")
const { User } = require("../models/user")
const HttpError = require("../helpers/httpError")
const sendEmail = require("../helpers/sendEmail")

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
   const { password, email } = req.body;
   const user = await User.findOne({ email })
   if (user) { throw HttpError(409, "Email in use") }
   const hashPassword = await bcrypt.hash(password, 10)
   const verificationToken = uniqid()
   const avatarURL = gravatar.url({ email })
   const resault = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken })
   const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}"> Click verify email</a>`
   }
   await sendEmail(verifyEmail)
   res.status(201).json({
      name: resault.name,
      email: resault.email,
   })
}

const verify = async (req, res) => {
   const { verificationToken } = req.params
   const user = await User.findOne({ verificationToken })
   if (!user) {
      throw HttpError(404, "Email not found")
   }
   await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null })
   res.json({
      message: "Email verify success"
   })
}

const resendVerifyEmail = async (req, res) => {
   const { email } = req.body
   const user = await User.findOne({ email })
   if (!user) { throw HttpError(400, "email not found") }
   if (user.verify) { throw HttpError(400, "Verification has already been passed") }
   const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}"> Click verify email</a>`
   }
   await sendEmail(verifyEmail)
   res.json({
      message: "Verification email sent"
   })
}

const login = async (req, res) => {
   const { password, email } = req.body;
   const user = await User.findOne({ email })
   if (!user) { throw HttpError(401, "Email or password is wrong") }
   if (!user.verify) { throw HttpError(401, "Email not verify") }
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

const updateAvatar = async (req, res) => {
   const { _id } = req.user
   const { path: tempUpload, filename } = req.file
   const avatarName = `${_id}_${filename}`
   const resaultUpLoad = path.join(avatarsDir, avatarName)
   await fs.rename(tempUpload, resaultUpLoad)
   const avatarURL = path.join("avatars", avatarName)
   await ImageSize(resaultUpLoad)
   await User.findByIdAndUpdate(_id, { avatarURL })
   res.json({ avatarURL })
}

module.exports = {
   register: controllerWrapper(register),
   verify: controllerWrapper(verify),
   resendVerifyEmail: controllerWrapper(resendVerifyEmail),
   login: controllerWrapper(login),
   getCurrent: controllerWrapper(getCurrent),
   logout: controllerWrapper(logout),
   updateAvatar: controllerWrapper(updateAvatar),
}