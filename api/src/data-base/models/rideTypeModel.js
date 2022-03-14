import mongoose from 'mongoose';
const rideTypeScheam = new mongoose.Schema({
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "serviceType",
    },
    allowedVehicleCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicleCategory",
    }],
    name: String,
    key: String,
    photo: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const RideTypeModel = mongoose.model('rideType', rideTypeScheam);
export default RideTypeModel;