import { Schema, model } from 'mongoose';

const ColorSchema = new Schema({
    name: String,
    code: String,

    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const ColorModel = model('color', ColorSchema);

export default ColorModel;