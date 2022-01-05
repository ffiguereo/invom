import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const SECRET = process.env.SECRET;
const HOST = process.env.SMTP_HOST
const PORT = process.env.SMTP_PORT
const Auth = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS

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

export function forgotPassword(req, res) {

    const {email} = req.body

    // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: Auth,
            pass: PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })


    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        UserModel.findOne({email: email})
            .then(user => {
                if (!user) {
                    return res.status(422).json({error: "User does not exist in our database"})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "Arc Invoice <hello@arcinvoice.com>",
                        subject: "Password reset request",
                        html: `
                    <p>You requested for password reset from Arc Invoicing application</p>
                    <h5>Please click this <a href="https://arcinvoice.com/reset/${token}">link</a> to reset your password</h5>
                    <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                    <p>https://arcinvoice.com/reset/${token}</p>
                    <P>If this was a mistake, just ignore this email and nothing will happen.</P>
                    `
                    })
                    res.json({message: "check your email"})
                }).catch((err) => console.log(err))

            })
    })
}

export function resetPassword(req, res) {
    const newPassword = req.body.password
    const sentToken = req.body.token
    UserModel.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                return res.status(422).json({error: "Try again session expired"})
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({message: "password updated success"})
                })
            })
        }).catch(err => {
        console.log(err)
    })
}
