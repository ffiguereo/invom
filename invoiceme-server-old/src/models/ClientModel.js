import mongoose from 'mongoose'

import {ENTERPRISE_MODEL_NAME} from "./EnterpriseModel";

export const CLIENT_MODEL_NAME = 'ClientModel';

const address = new mongoose.Schema({
    name: {type: String, required: true},
    idNumber: String,
    phone: {type: String, required: true},
    address: {type: String, required: true},
    addressExtra: String,
    city: {type: String, required: false},
    state: {type: String, required: false},
    country: {type: String, required: true},
    postalCode: {type: String, required: false},
});

const ClientSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: false},
    phone: {type: String, required: true},
    address: { type: [address], default: [] },
    enterprise: { type: mongoose.Schema.Types.ObjectId, ref: ENTERPRISE_MODEL_NAME, required: true },
    createdAt: { type: Date, default: new Date() }
})

const ClientModel = mongoose.model(CLIENT_MODEL_NAME, ClientSchema)
export default ClientModel
