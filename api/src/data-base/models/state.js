import { Schema, model } from 'mongoose';

const StateSchema = new Schema({
    name: String,
}, { timestamps: false });

const StateModel = model('state', StateSchema);

export default StateModel;