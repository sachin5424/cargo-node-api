import { Schema, model } from 'mongoose';

const MakeSchema = new Schema({
    name: String,
    key: String,

    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const MakeModel = model('make', MakeSchema);

export default MakeModel;