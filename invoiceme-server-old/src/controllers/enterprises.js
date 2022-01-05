import mongoose from 'mongoose';

import EnterpriseModel from '../models/EnterpriseModel';

export async function getEnterprise(req, res) {
    const {enterpriseId} = req.user;

    try {
        const enterprise = await EnterpriseModel.findById(enterpriseId);

        res.status(200).json(enterprise);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export async function updateEnterprise(req, res) {
    const {enterpriseId: _id} = req.user;

    const enterprise = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No enterprise with that id')

    const updatedEnterprise = await EnterpriseModel.findByIdAndUpdate(_id, {...enterprise, _id}, {new: true})

    res.json(updatedEnterprise)
}
