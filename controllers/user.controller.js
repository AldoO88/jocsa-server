const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');

const getUserById = async (req, res, next) => {
    const { userId } = req.params
    console.log(userId)
    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'wrong id'})
            return
        }
        const user = await User.findById(userId)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateUserProfile = async (req, res, next ) => {
    const { userId } = req.params
    const { firstName, lastName, phone, imageUrl } = req.body;
    console.log('imagenURL',imageUrl);

    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'wrong id'})
            return
        }

        if(firstName === '' || lastName === '' || phone === ''){
            res.status(400).json({ message: "The all fields  are required" })
            return
        }
        const updateUserProfile = await User.findByIdAndUpdate( userId, req.body, { new: true })
        res.status(201).json(updateUserProfile)
    } catch (error) {
        res.status(500).json(error)
    }
}


const updateUserPassword = async (req, res, next) => {
    const { userId } = req.params
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'wrong id'})
            return
        }

        if(currentPassword === '' || newPassword === '' || confirmNewPassword === ''){
            res.status(400).json({ message: "The all fields  are required" })
            return
        }

        const user = await User.findById(userId)
        if(!user) {
            res.status(400).json({ message: "The user does not exist" })
            return
        }

        const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password)

        if(!isPasswordCorrect) {
            res.status(400).json({ message: "The current password is incorrect" })
            return;
        }

        if(newPassword !== confirmNewPassword) {
            res.status(400).json({ message: "The passwords do not match" })
            return
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        const updateUserPassword = await User.findByIdAndUpdate( userId, { password: hashedPassword }, { new: true });
        res.status(201).json(updateUserPassword);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error);
    }
}

module.exports = {
    getUserById,
    updateUserProfile,
    updateUserPassword
};