import { Schema, model } from 'mongoose';

const MakeModelSchema = new Schema({
    make: {
        type: Schema.Types.ObjectId,
        ref: "make",
    },
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

const MakeModelModel = model('makeModel', MakeModelSchema);

export default MakeModelModel;