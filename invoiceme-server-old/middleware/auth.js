import jwt from 'jsonwebtoken'
import UserModel from "../models/UserModel.js";
import dotenv from 'dotenv'

dotenv.config()


const SECRET = process.env.SECRET;

// TODO AUTH MIDDLEWARE

async function auth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.sendStatus(401);
        }

        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500

        if (!token) {
            return res.sendStatus(401);
        }

        //If token is custom token do this
        if (isCustomAuth) {
            const decodeData = jwt.verify(token, SECRET)

            const user = await UserModel.findById(decodeData?.id).populate('enterprise')

            if (!user) {
                return res.sendStatus(403);
            }

            req.user = {
                id: user._id,
                email: user.email,
                enterpriseId: user.enterprise._id,
            }
        } else {
            // Else of token is google token then do this
            const decodeData = jwt.decode(token)

            req.userId = decodeData?.sub
        }

        next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(401);
    }
}

export default auth
