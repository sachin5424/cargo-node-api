import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
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
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    to: {
        type: String,
        enum: ['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins'],
    },
    userIds: [{
        type: Schema.Types.ObjectId
    }],
    content: {
        type: String
    },
}, { timestamps: true });


const NotificationModel = model('notification', NotificationSchema);
export default NotificationModel;