import mongoose from 'mongoose';
import moment from "moment";
import mongoosePaginate from 'mongoose-paginate-v2';
const Scheam = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    icon: {
        type: String,
        default: null
    },
    active: {
        type: Number,
        default: 1
    },
    slug: {
        type: String,
    },
    isdeleted: {
        type: Number,
        default: 0
    },
    activeLog: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user_auth",
            },
            method: {
                type: String,
                enum: ['GET', 'POST', 'DELETED', 'UPDATE']
            },
            oldData: {
                type: String,
                default: null
            },
            newData: {
                type: String,
                default: null
            },
            time: {
                type: Date,
                default: moment()
            }
        }
    ],
}, { timestamps: true });
Scheam.plugin(mongoosePaginate);
const tripCategorieModel = mongoose.model('trip_categories', Scheam);
export { tripCategorieModel };
