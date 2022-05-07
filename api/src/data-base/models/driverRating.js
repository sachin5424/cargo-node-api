import { Schema, model } from 'mongoose';
import DriverService from '../../services/DriverService';

const DriverRatingSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
    },
    point: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },

}, { timestamps: true });

DriverRatingSchema.post('save', async function (next) {
    try{
        await DriverService.updateRating(this.driver);
    } catch(err){
        next(err);
    }
    next();
});

const DriverRatingModel = model('driverRating', DriverRatingSchema);

export default DriverRatingModel;