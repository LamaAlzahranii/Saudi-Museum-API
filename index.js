const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const Joi = require("joi")
const JoiObjectId = require("joi-objectid")
Joi.ObjectId = JoiObjectId(Joi)
const users = require("./router/users")
const photos = require("./router/photos")
const router = require("./router/users")

mongoose
  .connect(
    `mongodb+srv://lama-2000:${process.env.MONGODB_PASSWORD}@cluster0.hfgau.mongodb.net/saudiDB?retryWrites=true&w=majority`
  )

  .then(() => console.log("conect to ManogoDB"))
  .catch(error => console.log("Erorr concting to ManogoDB", error))

const app = express()
app.use(express.json())

app.use(cors())
app.use("/api/auth", users)
app.use("/api/photos", photos)

const port = 3000
app.listen(port, () => console.log("sever is listing", port))



