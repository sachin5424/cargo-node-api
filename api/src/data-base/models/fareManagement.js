import mongoose, {Schema} from 'mongoose';


const FareManagementSchema = new mongoose.Schema({
    // serviceType: {
    //     type: Schema.Types.ObjectId,
    //     ref: "serviceType",
    // },
    rideType: {
        type: Schema.Types.ObjectId,
        ref: "rideType",
    },
    vehicleCategory: {
        type: Schema.Types.ObjectId,
        ref: "vehicleCategory",
    },
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

    baseFare: {
        type: Number,
        default: 0
    },
    bookingFare: {
        type: Number,
        default: 0
    },
    perMinuteFare: Number,
    cancelCharge: {
        type: Number,
        default: 0
    },
    waitingCharge: {
        type: Number,
        default: 0
    },
    adminCommissionType: {
        type: String,
        enum: ['percentage', 'flat'],
        default: 'percentage'
    },

    adminCommissionValue: {
        type: Number,
        default: 10
    },
    perKMCharges: [{
        maxKM: Number,
        charge: Number
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const FareManagementModel = mongoose.model('fareManagement', FareManagementSchema);
export default FareManagementModel;