import { Schema, model } from 'mongoose';

const TalukSchema = new Schema({
    name: String,
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "district",
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: false });

const TalukModel = model('taluk', TalukSchema);

export default TalukModel;
