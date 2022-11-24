const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const Pet = require("../models/Pet.model")
const User = require("../models/User.model")
const { isAuthenticated } = require('../middleware/jwt.middleware');

const fileUploader = require('../config/cloudinary.config');

router.post("/pet-profile/create", fileUploader.single('image'), isAuthenticated, async (req, res, next) => {
    const { name, image } = req.body
    image = req.file.path
    try {
        const petProfile = await Pet.create({ name, image, user: req.payload._id })
        const userDb = await User.findByIdAndUpdate(req.payload._id, { $push: { pet: petProfile._id } });
        res.json(petProfile);
    } catch (error) {
        res.json(error)
    }
})


router.get("/pet-profile", isAuthenticated, async (req, res, next) => {
    try {
        const petsProfiles = await Pet.find({user: req.payload._id})
        res.json(petsProfiles);
    } catch (error) {
        res.json(error)
    }
})


router.delete("/pet-profile/:petId", isAuthenticated, fileUploader.single('image'), isAuthenticated, async (req, res, next) => {
    const  petId = req.params.petId
    try {
        const petDb = await Pet.findOneAndDelete(req.payload.pet._id, { image: req.file.path })
        res.json(petProfile);
    } catch (error) {
        res.json(error)
    }
})

module.exports = router