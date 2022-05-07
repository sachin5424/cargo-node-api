import { Schema, model } from 'mongoose';

const DriverActiveSchema = new Schema({
    driverLogin: {
        type: Schema.Types.ObjectId,
        ref: "driverLogin",
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    startTime: {
        type: Date,
        default: Date.now()
    },
    endTime: {
        type: Date,
    },

}, { timestamps: false });

const DriverActiveModel = model('driverActive', DriverActiveSchema);

export default DriverActiveModel;