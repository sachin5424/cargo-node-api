import { Schema, model } from 'mongoose';

const SmsSentSchema = new Schema({
    smsTemplate: {
        type: Schema.Types.ObjectId,
        ref: "smsTemplate",
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "district",
    },
    taluk: {
        type: Schema.Types.ObjectId,
        ref: "taluk",
    },
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    to: {
        type: String,
        enum: ['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins', 'custom'],
    },
    phoneNumbers: [{
        type: String
    }],
    smsContent: String,
}, { timestamps: true });


const SmsSentModel = model('smsSent', SmsSentSchema);
export default SmsSentModel;