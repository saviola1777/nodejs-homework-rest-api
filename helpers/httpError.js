const errorMessage = {
   400: "missing required name field",
   401: "Unauthorized",
   403: "Forbidden",
   404: "Not Found",
   409: "Conflict",
   410: "Unauthorized",
}

const HttpError = (status, message = errorMessage[status]) => {
   const error = new Error(message)
   error.status = status
   return error
}

module.exports = HttpError