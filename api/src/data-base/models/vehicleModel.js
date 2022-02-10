import { Schema, model } from 'mongoose';

const vehicleModel = new Schema({
    name: String,
    description: String,

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


// vehicleModel.pre('save', function (next) { return next(); });

const VehicleModelModel = model('vehicleModel', vehicleModel);

export default VehicleModelModel;