import mongoose from 'mongoose'

import {ENTERPRISE_MODEL_NAME} from "./EnterpriseModel";
import {CLIENT_MODEL_NAME} from "./ClientModel";

export const INVOICE_MODEL_NAME = 'InvoiceModel';

function round(num) {
    return Math.round(num * 100) / 100;
}

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
    return round(total);
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
        currency: {type: String, required: true},
        items: { type: [invoiceItem], default: [] },
        rates: Number,
        notes: String,
        invoiceNumber: {type: Number, required: true, unique: true},
        type: {type: String, required: true},
        client: { type: mongoose.Schema.Types.ObjectId, ref: CLIENT_MODEL_NAME, required: true },
        enterprise: { type: mongoose.Schema.Types.ObjectId, ref: ENTERPRISE_MODEL_NAME, required: true },
        billingAddress: address,
        shippingAddress: address,
        paymentRecords: { type: [paymentRecord], default: [] },
        createdAt: {type: Date, default: new Date()}
    },
    {
        toJSON: {
            virtuals: true
        }
    }
)

InvoiceSchema.virtual('subtotal').get(function () {
    return this.items.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.amount;
    }, 0);
});

InvoiceSchema.virtual('vat').get(function () {
    const rates = this.rates || 0;
    const vat = (rates / 100) * this.subtotal;
    return round(vat);
});

InvoiceSchema.virtual('total').get(function () {
    // En vez de añadir el iva se va a quitar ya que los productos tienen el iva aplicado.
    const total = this.subtotal - this.vat;
    return round(total);
});

InvoiceSchema.virtual('totalAmountReceived').get(function () {
    return round(this.paymentRecords.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.amountPaid;
    }, 0));
});

InvoiceSchema.virtual('balance').get(function () {
    const balance = this.total - this.totalAmountReceived;
    return round(balance);
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
