import { Schema, model } from 'mongoose';

const ServiceTypeSchema = new Schema({
    name: String,
    key: String
}, { timestamps: false });

const ServiceTypeModel = model('serviceType', ServiceTypeSchema);

export default ServiceTypeModel;