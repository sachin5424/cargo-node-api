import mongoose from 'mongoose';
import moment from "moment";
const bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    email_verfiy: { type: Boolean, default: false },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: ['superAdmin', 'stateAdmin', 'districtAdmin', 'tehsilAdmin'],
        default: 'user',
    },
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
    joingDate: {
        type: Date,
        default: moment().format('YYYY/MM/DD')
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
const UserModel = mongoose.model('user_auth', UserSchema);
export { UserModel };