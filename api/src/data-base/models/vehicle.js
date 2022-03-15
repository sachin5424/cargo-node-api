import { Schema, model } from 'mongoose';

const VehicleSchema = new Schema({
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    name: String,
    vehicleNumber: String,
    availableSeats: Number,
    availableCapacity: Number,
    
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'driver',
    },
    vehicleCategory: {
        type: Schema.Types.ObjectId,
        ref: 'vehicleType',
    },
    primaryPhoto: String,
    otherPhotos: [{type: String}],
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "district",
    },
    taluk: {
        type: Schema.Types.ObjectId,
        ref: "taluk",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


// VehicleSchema.pre('save', function (next) { return next(); });

const VehicleModel = model('vehicle', VehicleSchema);

export default VehicleModel;