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
    // driver: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'driver',
    // },
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
    make: {
        type: Schema.Types.ObjectId,
        ref: "make",
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: "makeModel",
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: "color",
    },
    vehicleId: {
        type: Number,
        unique: true,
    },
    name: String,
    vehicleNumber: String,
    availableSeats: Number,
    availableCapacity: Number,
    manufacturingYear: Number,

    primaryPhoto: String,
    otherPhotos: [{ type: String }],

    registrationNumber: String,
    registrationExpiryDate: Date,
    registrationPhoto: String,
    
    insuranceNumber: String,
    insuranceExpiryDate: Date,
    insurancePhoto: String,
    
    permitNumber: String,
    permitExpiryDate: Date,
    permitPhoto: String,
    
    pollutionNumber: String,
    pollutionExpiryDate: Date,
    pollutionPhoto: String,
    
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