import mongoose from 'mongoose'

export const ENTERPRISE_MODEL_NAME = 'EnterpriseModel';

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

const enterpriseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: String,
    idNumber: String,
    billingAddress: address,
    logo: String,
    website: String,
    settings: {
        invoice: {
            copyright: String,
        }
    }
})

const EnterpriseModel = mongoose.model(ENTERPRISE_MODEL_NAME, enterpriseSchema)

export default EnterpriseModel
