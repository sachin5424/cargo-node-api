import { Schema, model } from 'mongoose';

const EmailSentSchema = new Schema({
    emailTemplate: {
        type: Schema.Types.ObjectId,
        ref: "emailTemplate",
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
    emailIds: [{
        type: String
    }],
    emailContent: {
        subject: String,
        html: String
    },
}, { timestamps: true });


const EmailSentModel = model('emailSent', EmailSentSchema);
export default EmailSentModel;