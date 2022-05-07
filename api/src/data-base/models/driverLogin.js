import { Schema, model } from 'mongoose';

const DriverLoginSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    loginTime: {
        type: Date,
        default: Date.now()
    },
    logoutTime: {
        type: Date,
    },

}, { timestamps: true });

const DriverLoginModel = model('driverLogin', DriverLoginSchema);

export default DriverLoginModel;