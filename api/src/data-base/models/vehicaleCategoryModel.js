import mongoose, {Schema} from 'mongoose';
const vehicleCategoryScheam = new mongoose.Schema({
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    },
    photo: {
        type: String,
        default: null
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

const VehicleCategoryModel = mongoose.model('vehicleCategory', vehicleCategoryScheam);
export default VehicleCategoryModel;