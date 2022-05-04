import { Schema, model } from 'mongoose';

const SmsTemplateSchema = new Schema({
    subject: String,
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


const SmsTemplateModel = model('smsTemplate', SmsTemplateSchema);
export default SmsTemplateModel;