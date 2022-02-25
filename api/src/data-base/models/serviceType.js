import { Schema, model } from 'mongoose';

const ServiceTypeSchema = new Schema({
    name: String,
    key: String
}, { timestamps: false });

const ServiceTypeeModel = model('serviceType', ServiceTypeSchema);

export default ServiceTypeeModel;