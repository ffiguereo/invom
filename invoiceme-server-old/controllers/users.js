import mongoose from 'mongoose'
import bcrypt from "bcryptjs";

import UserModel from "../models/UserModel.js";

// TODO REMOVE PASSWORD BEFORE SEND TO THE CLIENT

export const getUsers = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    try {
        const allUsers = await UserModel.find({ enterprise }).sort({_id:-1})

        res.status(200).json(allUsers)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const createUser = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const user = req.body

    // TODO VALIDATE THE BODY
    const hashedPassword = await bcrypt.hash(user.password, 12)
    const newUser = new UserModel({
        ...user,
        password: hashedPassword,
        enterprise,
    })

    const existingUser = await UserModel.findOne({email: user.email})
    if (existingUser) return res.status(400).json({message: "User already exist"})

    try {
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const getUser = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const { id } = req.params;

    try {
        const user = await UserModel.findOne({
            _id: id,
            enterprise
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const { id: _id } = req.params
    const user = req.body
    // TODO VALIDATE THE BODY

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that id')

    if (!!user.password) {
        delete user.password;
    }

    const updatedUser = await UserModel.findOneAndUpdate({
        _id,
        enterprise,
    }, {...user, _id, enterprise}, { new: true})

    res.json(updatedUser)
}


export const deleteUser = async (req, res) => {
    const { id: authUserId, enterpriseId: enterprise } = req.user;

    const { id } = req.params

    if (id === authUserId) {
        return res.status(401).send('Forbidden')
    }

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No invoice with that id')

    await UserModel.findOneAndRemove({
        _id: id,
        enterprise
    })

    res.json({message: 'User deleted successfully'})
}
