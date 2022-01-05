import mongoose from 'mongoose'

export const ENTERPRISE_MODEL_NAME = 'EnterpriseModel';

const address = new mongoose.Schema({
    address: {type: String, required: true},
    addressExtra: String,
    city: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    postalCode: {type: String, required: true},
});

const enterpriseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: String,
    idNumber: String,
    address: address,
    logo: String,
    website: String,
})

const EnterpriseModel = mongoose.model(ENTERPRISE_MODEL_NAME, enterpriseSchema)

export default EnterpriseModel
