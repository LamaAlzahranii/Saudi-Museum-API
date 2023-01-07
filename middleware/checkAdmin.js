const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is missing ")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRT_KEY)

    const userId = decryptedToken.id
    const adminFound = await User.findById(userId)
    if (!adminFound) return res.status(404).json("user not found")

    if (adminFound.role !== "Admin") return res.status(403).json("you are not admin")

    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = checkAdmin
