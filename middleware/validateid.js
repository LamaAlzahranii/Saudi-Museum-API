const mongoose = require("mongoose")
const validateid = (...idArray) => {
  return async (req, res, next) => {
    try {
      idArray.forEach(idName => {
        const id = req.params[idName]
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send(`the path${idName} is not a valid`)
      })
      next()
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = validateid
