import { Schema, model } from 'mongoose';

const VehicleSchema = new Schema({
    name: String,
    photo: String,
    vehicleNumber: String,
    availableSeats: Number,

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user_auth',
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'driver',
    },
    vehicleType: {
        type: Schema.Types.ObjectId,
        ref: 'vehicleType',
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