const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkToken = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json("token is missing ")

  const decryptedToken = jwt.verify(token, process.env.JWT_SECRT_KEY)

  const userId = decryptedToken.id
  const user = await User.findById(userId)

  if (!user) return res.status(404).json("user not found")
  req.userId = userId

  next()
}

module.exports = checkToken
