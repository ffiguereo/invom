import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

const SECRET = process.env.SECRET;

import UserModel from '../models/UserModel.js'
import EnterpriseModel from '../models/EnterpriseModel.js';

export function createJwtToken(userModel) {
    return jwt.sign(
        {
            email: userModel.email,
            enterprise: userModel.enterprise,
            id: userModel._id
        },
        SECRET,
        {
            expiresIn: "1d"
        }
    )
}

export async function signIn(req, res) {
    const {email, password} = req.body //Coming from formData

    try {
        const existingUser = await UserModel.findOne({email})

        if (!existingUser) return res.status(404).json({message: "User doesn't exist"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        // If credentials are valid, create a token for the user
        const token = createJwtToken(existingUser);

        //Then send the token to the client/frontend
        res.status(200).json({result: existingUser, token})
    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}

export async function me(req, res) {
    const { id } = req.user;

    try {
        const user = await UserModel.findById(id).populate('enterprise');

        res.status(200).json(user);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export async function signup(req, res) {
    try {
        const {enterprise, user} = req.body
        // TODO VALIDATE THE DATA
        const existingEnterprise = await EnterpriseModel.findOne({email: enterprise.email})

        if (existingEnterprise) return res.status(400).json({message: "Enterprise already exist"})

        const existingUser = await UserModel.findOne({email: user.email})

        if (existingUser) return res.status(400).json({message: "User already exist"})

        // TODO CREATE TRANSACTION

        const newEnterprise = await EnterpriseModel.create({
            name: enterprise.name,
            email: enterprise.email,
        });

        const hashedPassword = await bcrypt.hash(user.password, 12)
         const newUser = await UserModel.create({
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
            enterprise: newEnterprise._id,
        })

        const token = createJwtToken(newUser);

        res.status(200).json({token})

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
}
