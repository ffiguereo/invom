import mongoose from 'mongoose'

import {ENTERPRISE_MODEL_NAME} from "./EnterpriseModel";

export const USER_MODEL_NAME = 'UserModel';

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true },
        enterprise: { type: mongoose.Schema.Types.ObjectId, ref: ENTERPRISE_MODEL_NAME, required: true },
        resetToken: String,
        expireToken: Date,
    }
)

const UserModel = mongoose.model(USER_MODEL_NAME, userSchema)

export default UserModel
