import mongoose from 'mongoose'

import InvoiceModel from '../models/InvoiceModel.js'

export const getInvoices = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    try {
        const allInvoices = await InvoiceModel.find({enterprise}).populate(['client', 'enterprise']).sort({_id: -1})

        res.status(200).json(allInvoices)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const createInvoice = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const invoice = req.body

    // TODO VALIDATE THE BODY

    const newInvoice = new InvoiceModel({
        client: invoice.client,
        rates: invoice.rates,
        notes: invoice.notes,
        type: invoice.type,
        dueDate: invoice.dueDate,
        currency: invoice.currency,
        billingAddress: invoice?.billingAddress,
        shippingAddress: invoice?.shippingAddress,
        invoiceNumber: invoice.invoiceNumber,
        enterprise
    })

    try {
        await newInvoice.save()
        res.status(201).json(newInvoice)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const getInvoice = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id} = req.params;

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        }).populate(['client', 'enterprise']);

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateInvoice = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id: _id} = req.params
    const invoice = req.body
    // TODO VALIDATE THE BODY

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No invoice with that id')

    const updatedInvoice = await InvoiceModel.findOneAndUpdate({
        _id,
        enterprise,
    }, {
        client: invoice?.client,
        rates: invoice?.rates,
        notes: invoice?.notes,
        type: invoice?.type,
        dueDate: invoice?.dueDate,
        currency: invoice?.currency,
        billingAddress: invoice?.billingAddress,
        shippingAddress: invoice?.shippingAddress,
        invoiceNumber: invoice?.invoiceNumber,
    });

    res.json(updatedInvoice)
}


export const deleteInvoice = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No invoice with that id')

    await InvoiceModel.findOneAndRemove({
        _id: id,
        enterprise
    })

    res.json({message: 'Invoice deleted successfully'})
}

export const addInvoicePayment = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id} = req.params;
    const payment = req.body;

    // TODO VALIDATE

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.paymentRecords.push({
            amountPaid: payment.amountPaid,
            datePaid: payment.datePaid,
            paymentMethod: payment.paymentMethod,
            note: payment.note
        });

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const deleteInvoicePayment = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id, paymentId} = req.params;

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.paymentRecords.id(paymentId).remove();

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateInvoicePayment = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id, paymentId} = req.params;
    const invoicePayment = req.body;

    // TODO VALIDATE

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.paymentRecords.id(paymentId).set({
            amountPaid: invoicePayment?.amountPaid,
            datePaid: invoicePayment?.datePaid,
            paymentMethod: invoicePayment?.paymentMethod,
            note: invoicePayment?.note
        });

        // TODO CHANGE STATE

        await invoice.save()

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const addInvoiceItem = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id} = req.params;
    const invoiceItem = req.body;

    // TODO VALIDATE

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.items.push({
            name: invoiceItem.name,
            unitPrice: invoiceItem.unitPrice,
            quantity: invoiceItem.quantity,
            discount: invoiceItem.discount
        });

        // TODO CHANGE STATE

        await invoice.save();

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const deleteInvoiceItem = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id, itemId} = req.params;

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.items.id(itemId).remove();

        // TODO CHANGE STATE

        await invoice.save()

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateInvoiceItem = async (req, res) => {
    const {enterpriseId: enterprise} = req.user;

    const {id, itemId} = req.params;
    const invoiceItem = req.body;

    // TODO VALIDATE

    try {
        const invoice = await InvoiceModel.findOne({
            _id: id,
            enterprise
        });

        invoice.items.id(itemId).set({
            name: invoiceItem?.name,
            unitPrice: invoiceItem?.unitPrice,
            quantity: invoiceItem?.quantity,
            discount: invoiceItem?.discount
        });

        // TODO CHANGE STATE

        await invoice.save()

        res.status(200).json(invoice);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}
