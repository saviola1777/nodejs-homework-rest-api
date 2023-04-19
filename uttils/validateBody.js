const HttpError = require("../helpers/httpError")

const validateBody = schema => {
   const func = async(req , res ,next)=>{
      const { error } = schema.validate(req.body)
      if (error) {
       next(HttpError(400))
      }
      next()
   }
   return func
}

module.exports = validateBody