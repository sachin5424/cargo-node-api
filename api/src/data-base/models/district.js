import { Schema, model } from 'mongoose';

const DistrictSchema = new Schema({
    name: String,
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
    }
}, { timestamps: false });

const DistrictModel = model('district', DistrictSchema);

export default DistrictModel;
