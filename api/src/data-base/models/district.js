import { Schema, model } from 'mongoose';

const DistrictSchema = new Schema({
    name: String,
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
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

const DistrictModel = model('district', DistrictSchema);

export default DistrictModel;
