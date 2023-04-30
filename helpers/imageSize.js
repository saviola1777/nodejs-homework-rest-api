const Jimp = require("jimp")
const HttpError = require("./httpError")

const ImageSize = (path) => {
    Jimp.read(path)
      .then((image) => {
         image.resize(250, 250)
         image.write(path)
      })
      .catch((err) => {
         throw HttpError(404, err.message)
      });
}

module.exports = ImageSize