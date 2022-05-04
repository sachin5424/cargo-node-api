import mongoose, {Schema} from 'mongoose';
const farePackageScheam = new mongoose.Schema({
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    name: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const FarePackageModel = mongoose.model('farePackage', farePackageScheam);
export default FarePackageModel;