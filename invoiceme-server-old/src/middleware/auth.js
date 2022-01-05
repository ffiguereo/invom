import jwt from 'jsonwebtoken'
import UserModel from "../models/UserModel";

async function auth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.sendStatus(401);
        }

        const token = req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.sendStatus(401);
        }

        const decodeData = jwt.verify(token, process.env.SECRET)

        const user = await UserModel.findById(decodeData?.id).populate('enterprise')

        if (!user) {
            return res.sendStatus(403);
        }

        req.user = {
            id: user._id,
            email: user.email,
            enterpriseId: user.enterprise._id,
        }

        next()

    } catch (error) {
        console.log(error)
        return res.sendStatus(401);
    }
}

export default auth
