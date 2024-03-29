import mongoose, {Schema} from 'mongoose';
import moment from "moment";
const bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;


const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['superAdmin', 'stateAdmin', 'districtAdmin', 'talukAdmin'],
    },
    firstName: String,
    lastName: String,
    phoneNo: String,
    email: String,
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    userName: {
        type: String,
        unique: true
    },
    password: String,
    dob: Date,
    photo: String,

    address: String,
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
    zipcode: String,

    adharNo: String,
    adharCardPhoto: String,

    panNo: String,
    panCardPhoto: String,

    modules: [
        {
            type: String,
        }
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isStaf: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
UserSchema.pre('save', function (next) {
    // var otp = Math.floor(10000 + Math.random() * 900000);
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
const UserModel = mongoose.model('user', UserSchema);
export { UserModel };