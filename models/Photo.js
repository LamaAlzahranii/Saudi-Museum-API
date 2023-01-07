const mongoose = require("mongoose")
const Joi = require("joi")
const photoSchema = new mongoose.Schema({
 
  name: String,
  year: Number,
  pic: String,
  description: String,
  saveds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
})
const photoAddJoi = Joi.object({
  name: Joi.string().min(1).max(200),
  year: Joi.number().min(1800),
  pic: Joi.string().min(1).max(2000),
  description:Joi.string().min(1).max(2000),
})
const photoEditJoi = Joi.object({
  name: Joi.string().min(1).max(200),
  year: Joi.number().min(1800),
  pic: Joi.string().min(1).max(2000),
  description:Joi.string().min(1).max(2000),

})

const Photo = mongoose.model("Photo ", photoSchema)

module.exports.Photo = Photo
module.exports.photoAddJoi = photoAddJoi
module.exports.photoEditJoi = photoEditJoi
