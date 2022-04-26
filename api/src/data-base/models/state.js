import { Schema, model } from 'mongoose';

const StateSchema = new Schema({
    name: String,
    isActive: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: false });

const StateModel = model('state', StateSchema);

export default StateModel;