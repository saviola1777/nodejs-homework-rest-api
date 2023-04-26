const { Schema, model } = require("mongoose")

const { handleMongooseError } = require("../uttils/index")

const Joi = require("joi")

const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         match: mailformat,
         required: [true, 'Email is required'],
         unique: true,
      },
      password: {
         type: String,
         minlength: 6,
         required: [true, 'Set password for user'],
      },
      subscription: {
         type: String,
         enum: ["starter", "pro", "business"],
         default: "starter"
      },
      token: {
         type: String,
         default: "",
      }
   }, { versionKey: false })

userSchema.post("save", handleMongooseError)

const registerSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().pattern(mailformat).required(),
   password: Joi.string().min(6).required(),
})

const User = model("user", userSchema)

module.exports = { User, registerSchema }