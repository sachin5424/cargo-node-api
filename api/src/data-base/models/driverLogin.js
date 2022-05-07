import { Schema, model } from 'mongoose';
import DriverActiveModel from './driverActive';

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

}, { timestamps: false });

DriverLoginSchema.post('save', async function (next) {
    try{
        const tplData = new DriverActiveModel();
        tplData.driver = this.driver;
        tplData.driverLogin = this._id;
        await tplData.save();
    } catch(err){
        next(err);
    }
    next();
});

const DriverLoginModel = model('driverLogin', DriverLoginSchema);

export default DriverLoginModel;