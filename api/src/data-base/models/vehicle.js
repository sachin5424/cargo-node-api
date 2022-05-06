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

    isApproved: {
        type: Boolean,
        default: false
    },    
    addedBy: {
        type: String,
        enum: ['admin', 'driver'],
        default: 'driver'
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

VehicleSchema.pre('save', async function (next) {
    try{
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        if(!this.vehicleId || this.vehicleId < 1232141){
            const ld = await VehicleModel.findOne().sort({ vehicleId: -1 });
            if(ld && ld.vehicleId >= 1232141){
                this.vehicleId = ld.vehicleId + 1;
            } else{
                this.vehicleId = 1232141;
            }
        }
    } catch(err){
        next(err);
    }
    next();
});

const VehicleModel = model('vehicle', VehicleSchema);

export default VehicleModel;