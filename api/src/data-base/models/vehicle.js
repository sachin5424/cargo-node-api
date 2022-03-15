import { Schema, model } from 'mongoose';

const VehicleSchema = new Schema({
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    rideTypes: [
        {
            type: Schema.Types.ObjectId,
            ref: "rideType",
        }
    ],
    vehicleCategory: {
        type: Schema.Types.ObjectId,
        ref: "vehicleCategory",
    },
    name: String,
    vehicleNumber: String,
    availableSeats: Number,
    availableCapacity: Number,

    // driver: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'driver',
    // },
    primaryPhoto: String,
    otherPhotos: [{ type: String }],
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