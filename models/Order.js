const mongoose = require('mongoose');

const getFormattedDate = (date) => (String(date.getFullYear()) + '-' + (date.getMonth() < 10 ? '0' + String(date.getMonth()+1) : String(date.getMonth())) + '-' + (date.getDate() < 10 ? '0' + String(date.getDate()) : String(date.getDate())))

const OrderAttachmentSchema = new mongoose.Schema({
    attachment_type: String,
    attachment: String,
    attachment_for: String,
    status:{
        type:Number,
        default: 1
    },
}, {timestamps: true})

const OrderSchema = new  mongoose.Schema({
    entry_number:{
        type: String,
        required: true
    },
    order_number:{
        type: String,
        required: true
    },
    vendor_id:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'

    },
    salesman_id:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    color:{
        type: String,
        required: true
    },
    item:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true,
        default: getFormattedDate(new Date())
    },
    ready_date:{
        type: String,
        required: true,
        default: getFormattedDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
    },
    delivery_date:{
        type: String,
        required: true,
        default: getFormattedDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000))
    },
    attachments: [OrderAttachmentSchema],
    status:{
        type: Number,
        default: 1 
    }
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema)