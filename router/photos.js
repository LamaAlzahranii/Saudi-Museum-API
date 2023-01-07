const express = require("express")
const checkId = require("../middleware/checkId")
const validateBody = require("../middleware/validateBody")
const checkAdmin = require("../middleware/checkAdmin")
const validateid = require("../middleware/validateid")
const checkToken = require("../middleware/checkToken")
const { Photo, photoAddJoi, photoEditJoi } = require("../models/Photo")
const { User } = require("../models/User")
const router = express.Router()

//------------------------------get all photo------------------------------//
router.get("/", async (req, res) => {
  const photos = await Photo.find()
  res.json(photos)
})

//------------------------------get one photo------------------------------//
router.get("/:id", checkId, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
    
    if (!photo) return res.status(404).send("photo not found")

    res.json(photo)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

//------------------------------post photo------------------------------//
router.post("/", checkAdmin, validateBody(photoAddJoi), async (req, res) => {
  try {
    const { name, year, pic, description } = req.body

    const photo = new Photo({
      name,
      year,
      pic,
      description,

    })
    await photo.save()
    res.json(photo)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

//------------------------------edit photo------------------------------//

router.put("/:id", checkAdmin, checkId, validateBody(photoEditJoi), async (req, res) => {
  try {
    const { name, year, pic , description } = req.body

    const photo = await Photo.findByIdAndUpdate(
      req.params.id,

      {
        $set: {
          name,
          year,
          pic,
          description,
        },
      },
      { new: true }
    )
    if (!photo) return res.status(404).send("photo not found")
    res.json(car)
  } catch (error) {
    console.log(error)
    res.status(300).send(error.message)
  }
})

//------------------------------delete photo------------------------------//

router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndRemove(req.params.id)
    if (!photo) return res.status(404).send("photo not found")
    res.send("photo is removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//------------------------------saveds------------------------------//
router.get("/:photoId/saveds", checkToken, validateid("photoId"), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId)
    if (!photo) return res.status(404).send("photoId not found")

    const userFound = photo.saveds.find(saved => saved == req.userId)
    if (userFound) {
      await Photo.findByIdAndUpdate(req.params.photoId, { $pull: { saveds: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { saveds: req.params.photoId } })

      res.send("remove save from photo")
    } else {
      await Photo.findByIdAndUpdate(req.params.photoId, { $push: { saveds: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { saveds: req.params.photoId } })
      res.send("photo saved")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

module.exports = router;
