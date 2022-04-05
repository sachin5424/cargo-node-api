import { Schema, model } from 'mongoose';

const EmailTemplateSchema = new Schema({
    title: String,
    key: {
        type: String,
        unique: true
    },
    html: String,
    deletable: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });


const EmailTemplateModel = model('emailTemplate', EmailTemplateSchema);
export default EmailTemplateModel;