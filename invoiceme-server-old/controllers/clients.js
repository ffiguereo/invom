import mongoose from 'mongoose'

import ClientModel from '../models/ClientModel.js'

export const getClient = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;
    const { id } = req.params;

    try {
        console.log({id, enterprise});
        const client = await ClientModel.findOne({ _id: id, enterprise });
        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getClients = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;
    try {
        const clients = await ClientModel.find({ enterprise }).sort({ _id: -1 });

        res.json(clients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createClient = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const client = req.body
    // TODO VALIDATE THE BODY

    const existingClient = await ClientModel.findOne({email: client.email, enterprise })
    if (existingClient) return res.status(400).json({message: "Client already exist"})

    const newClient = new ClientModel({...client, enterprise, createdAt: new Date().toISOString() })

    try {
        await newClient.save()
        res.status(201).json(newClient)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const updateClient = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const { id } = req.params
    const client = req.body

    // TODO VALIDATE THE BODY

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No client with that id')

    const updatedClient = await ClientModel.findOneAndUpdate({
        _id: id,
        enterprise,
    }, {...client, _id: id, enterprise}, { new: true})

    res.json(updatedClient)
}


export const deleteClient = async (req, res) => {
    const { enterpriseId: enterprise } = req.user;

    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Client with that id')

    await ClientModel.findOneAndRemove({
        _id: id,
        enterprise
    })

    res.json({message: 'Client deleted successfully'})
}

export const createClientAddress = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {clientId} = req.params;
    const clientAddress = req.body;

    // TODO VALIDATE

    try {
        const client = await ClientModel.findOne({
            _id: clientId,
            enterprise
        });

        client.address.push({
            name: clientAddress.name,
            idNumber: clientAddress.idNumber,
            phone: clientAddress.phone,
            address: clientAddress.address,
            addressExtra: clientAddress.addressExtra,
            city: clientAddress.city,
            state: clientAddress.state,
            country: clientAddress.country,
            postalCode: clientAddress.postalCode,
        });

        await client.save();

        res.status(200).json(client);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const deleteClientAddress = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {clientId, addressId} = req.params;

    try {
        const client = await ClientModel.findOne({
            _id: clientId,
            enterprise
        });

        client.address.id(addressId).remove();

        await client.save()

        res.status(200).json(client);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateClientAddress = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {clientId, addressId} = req.params;
    const clientAddress = req.body;

    // TODO VALIDATE

    try {
        const client = await ClientModel.findOne({
            _id: clientId,
            enterprise
        });

        client.address.id(addressId).set({
            name: clientAddress?.name,
            idNumber: clientAddress?.idNumber,
            phone: clientAddress?.phone,
            address: clientAddress?.address,
            addressExtra: clientAddress?.addressExtra,
            city: clientAddress?.city,
            state: clientAddress?.state,
            country: clientAddress?.country,
            postalCode: clientAddress?.postalCode,
        });

        await client.save()

        res.status(200).json(client);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}
