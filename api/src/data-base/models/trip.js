import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const TripSchema = new Schema({
    tripCategory: {
        type: Schema.Types.ObjectId,
        ref: "trip_categories",
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: "vehicle",
    },
    pickupLocation: {
        name: String,
        latlong: String,
    },
    destinationLocation: {
        name: String,
        latlong: String,
    },
    dateTime: dateTime,
    status: {
        type: String,
        enum: ['driverComing', 'driverWaiting', 'cancel', 'complete'],
    },
}, { timestamps: true });


// TripSchema.pre('save', function (next) { return next(); });


TripSchema.pre('save', async function (next) {
    try{
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    } catch(err){
        next(err);
    }
    next();
});

const TripModel = model('trip', TripSchema);

export default TripModel;