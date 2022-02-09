import { Schema, model } from 'mongoose';

const VehicleTypeSchema = new Schema({
    name: String,
    icon: String,
    priceKM: Number,

    tripCategories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'trip_categories',
        }
    ],
    vehicleCategory: {
        type: Schema.Types.ObjectId,
        ref: 'vehhical_categories',
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


// VehicleTypeSchema.pre('save', function (next) { return next(); });

const VehicleTypeModel = model('vehicleType', VehicleTypeSchema);

export default VehicleTypeModel;