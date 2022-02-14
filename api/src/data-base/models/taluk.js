import { Schema, model } from 'mongoose';

const TalukSchema = new Schema({
    name: String,
    district: {
        type: Schema.Types.ObjectId,
        ref: "district",
    }
}, { timestamps: false });

const TalukModel = model('taluk', TalukSchema);

export default TalukModel;
