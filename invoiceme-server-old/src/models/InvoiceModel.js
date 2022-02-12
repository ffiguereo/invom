import mongoose from 'mongoose'

import {ENTERPRISE_MODEL_NAME} from "./EnterpriseModel";
import {CLIENT_MODEL_NAME} from "./ClientModel";
import {round, extractIva} from "../utils";

export const INVOICE_MODEL_NAME = 'InvoiceModel';

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

const paymentRecord= new mongoose.Schema({
    amountPaid: {type: Number, required: true},
    datePaid: {type: Date, required: true},
    paymentMethod: {type: String, required: true},
    note: String
});

const invoiceItem = new mongoose.Schema(
    {
        name: {type: String, required: true},
        unitPrice: {type: Number, required: true},
        quantity: {type: Number, required: true},
        discount: Number
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

invoiceItem.virtual('amount').get(function () {
    const amount = this.quantity * this.unitPrice;
    const discount = this.discount || 0;
    const total = amount - (amount * (discount / 100));
    return round(total, 2);
});

export const InvoiceStatus = {
    Draft: 'Draft',
    Unpaid: 'Unpaid',
    Paid: 'Paid',
    Partial: 'Partial',
}

const InvoiceSchema = new mongoose.Schema(
    {
        dueDate: Date,
        currency: { type: String, required: true},
        items: { type: [invoiceItem], default: [] },
        rates: { type: Number, default: 0},
        notes: String,
        invoiceNumber: {type: Number, required: true, unique: true},
        type: { type: String, required: true},
        client: { type: mongoose.Schema.Types.ObjectId, ref: CLIENT_MODEL_NAME, required: true },
        enterprise: { type: mongoose.Schema.Types.ObjectId, ref: ENTERPRISE_MODEL_NAME, required: true },
        billingAddress: address,
        shippingAddress: address,
        paymentRecords: { type: [paymentRecord], default: [] },
        createdAt: { type: Date, default: new Date()}
    },
    {
        toJSON: {
            virtuals: true
        }
    }
)

InvoiceSchema.virtual('rawSubtotal').get(function () {
    return this.items.reduce((a, c) => a + extractIva(c.amount, this.rates || 0), 0);
});

InvoiceSchema.virtual('subtotal').get(function () {
    return round(this.rawSubtotal, 2);
});

InvoiceSchema.virtual('vat').get(function () {
    const rates = this.rates || 0;
    const vat = (rates / 100) * this.rawSubtotal;
    return round(vat, 2);
});

InvoiceSchema.virtual('total').get(function () {
    return round(this.rawSubtotal + this.vat, 2);
});

InvoiceSchema.virtual('totalAmountReceived').get(function () {
    return this.paymentRecords.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.amountPaid;
    }, 0);
});

InvoiceSchema.virtual('balance').get(function () {
    return this.total - this.totalAmountReceived;

});

InvoiceSchema.virtual('status').get(function () {
    if (this.items.length === 0) {
        return InvoiceStatus.Draft;
    }

    if (this.totalAmountReceived > 0 && this.totalAmountReceived >= this.total) {
        return InvoiceStatus.Paid
    }

    if (this.totalAmountReceived > 0) {
        return InvoiceStatus.Partial
    }

    return InvoiceStatus.Unpaid
})

const InvoiceModel = mongoose.model(INVOICE_MODEL_NAME, InvoiceSchema)
export default InvoiceModel
