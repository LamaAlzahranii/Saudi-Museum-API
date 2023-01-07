const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const router = express.Router()
const validateBody = require("../middleware/validateBody")
const checkAdmin = require("../middleware/checkAdmin")
const checkToken = require("../middleware/checkToken")
const { User, signupJoi, loginJoi, profileJoi } = require("../models/User")
const { restart } = require("nodemon")
const { required } = require("joi")
require("dotenv").config()

//-----------------------signup users-----------------------//

router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json("user already register")

    const salt = await bcrypt.genSalt(10) 
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hash,
      role: "User",
    })
    await user.save()

    delete user._doc.password

    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//-----------------------login users-----------------------//

router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not found")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json("password incorecct")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRT_KEY, { expiresIn: "15d" }) 
    res.send(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//-----------------------login admin-----------------------//

router.post("/login/admin", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json("user not regiser")
    if (user.role != "Admin") return res.status(403).send("you are not admin")
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json("password incorecct")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRT_KEY, { expiresIn: "15d" })
    res.send(token)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//-----------------------get profile-----------------------//

router.get("/profile", checkToken, async (req, res) => {
  const user = await User.findById(req.userId).select("-_v -password").populate("saveds")
  res.json(user)
})
//-----------------------edit profile-----------------------//

router.put("/profile", checkToken, async (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body
  const result = profileJoi.validate(req.body)
  if (result.error) return res.status(400).json(result.error.details[0].message)
  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { firstName, lastName, phoneNumber, password: hash } },
    { new: true }
  ).select("-__v -password")

  res.json(user)
})

module.exports = router
