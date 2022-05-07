import { Schema, model } from 'mongoose';

const DriverActiveSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    driverLogin: {
        type: Schema.Types.ObjectId,
        ref: "driverLogin",
    },
    startTime: {
        type: Date,
        default: Date.now()
    },
    endTime: {
        type: Date,
    },

}, { timestamps: true });

const DriverActiveModel = model('driverActive', DriverActiveSchema);

export default DriverActiveModel;