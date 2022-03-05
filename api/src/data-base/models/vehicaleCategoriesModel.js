import mongoose from 'mongoose';
import moment from "moment";
import mongoosePaginate from 'mongoose-paginate-v2';
const vehicalCategorieScheam = new mongoose.Schema({
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
                ref: "users",
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
vehicalCategorieScheam.plugin(mongoosePaginate);
const VehicalCategorieModel = mongoose.model('vehhical_categories', vehicalCategorieScheam);
export { VehicalCategorieModel };