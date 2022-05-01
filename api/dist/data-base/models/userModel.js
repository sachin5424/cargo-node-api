"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const bcrypt = require('bcryptjs'),
      SALT_WORK_FACTOR = 10;

const UserSchema = new _mongoose.default.Schema({
  type: {
    type: String,
    enum: ['superAdmin', 'stateAdmin', 'districtAdmin', 'talukAdmin']
  },
  firstName: String,
  lastName: String,
  phoneNo: String,
  email: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  password: String,
  dob: Date,
  photo: String,
  address: String,
  state: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "state"
  },
  district: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "district"
  },
  taluk: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "taluk"
  },
  zipcode: String,
  adharNo: String,
  adharCardPhoto: String,
  panNo: String,
  panCardPhoto: String,
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
}, {
  timestamps: true
});
UserSchema.pre('save', function (next) {
  // var otp = Math.floor(10000 + Math.random() * 900000);
  var user = this; // only hash the password if it has been modified (or is new)

  if (!user.isModified('password')) return next(); // generate a salt

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err); // hash the password using our new salt

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err); // override the cleartext password with the hashed one

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const UserModel = _mongoose.default.model('user', UserSchema);

exports.UserModel = UserModel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL3VzZXJNb2RlbC5qcyJdLCJuYW1lcyI6WyJiY3J5cHQiLCJyZXF1aXJlIiwiU0FMVF9XT1JLX0ZBQ1RPUiIsIlVzZXJTY2hlbWEiLCJtb25nb29zZSIsIlNjaGVtYSIsInR5cGUiLCJTdHJpbmciLCJlbnVtIiwiZmlyc3ROYW1lIiwibGFzdE5hbWUiLCJwaG9uZU5vIiwiZW1haWwiLCJlbWFpbFZlcmlmaWVkIiwiQm9vbGVhbiIsImRlZmF1bHQiLCJwYXNzd29yZCIsImRvYiIsIkRhdGUiLCJwaG90byIsImFkZHJlc3MiLCJzdGF0ZSIsIlR5cGVzIiwiT2JqZWN0SWQiLCJyZWYiLCJkaXN0cmljdCIsInRhbHVrIiwiemlwY29kZSIsImFkaGFyTm8iLCJhZGhhckNhcmRQaG90byIsInBhbk5vIiwicGFuQ2FyZFBob3RvIiwiaXNBY3RpdmUiLCJpc0FkbWluIiwiaXNTdGFmIiwiaXNEZWxldGVkIiwidGltZXN0YW1wcyIsInByZSIsIm5leHQiLCJ1c2VyIiwiaXNNb2RpZmllZCIsImdlblNhbHQiLCJlcnIiLCJzYWx0IiwiaGFzaCIsIm1ldGhvZHMiLCJjb21wYXJlUGFzc3dvcmQiLCJjYW5kaWRhdGVQYXNzd29yZCIsImNiIiwiY29tcGFyZSIsImlzTWF0Y2giLCJVc2VyTW9kZWwiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7OztBQUNBLE1BQU1BLE1BQU0sR0FBR0MsT0FBTyxDQUFDLFVBQUQsQ0FBdEI7QUFBQSxNQUFvQ0MsZ0JBQWdCLEdBQUcsRUFBdkQ7O0FBR0EsTUFBTUMsVUFBVSxHQUFHLElBQUlDLGtCQUFTQyxNQUFiLENBQW9CO0FBQ25DQyxFQUFBQSxJQUFJLEVBQUU7QUFDRkEsSUFBQUEsSUFBSSxFQUFFQyxNQURKO0FBRUZDLElBQUFBLElBQUksRUFBRSxDQUFDLFlBQUQsRUFBZSxZQUFmLEVBQTZCLGVBQTdCLEVBQThDLFlBQTlDO0FBRkosR0FENkI7QUFLbkNDLEVBQUFBLFNBQVMsRUFBRUYsTUFMd0I7QUFNbkNHLEVBQUFBLFFBQVEsRUFBRUgsTUFOeUI7QUFPbkNJLEVBQUFBLE9BQU8sRUFBRUosTUFQMEI7QUFRbkNLLEVBQUFBLEtBQUssRUFBRUwsTUFSNEI7QUFTbkNNLEVBQUFBLGFBQWEsRUFBRTtBQUNYUCxJQUFBQSxJQUFJLEVBQUVRLE9BREs7QUFFWEMsSUFBQUEsT0FBTyxFQUFFO0FBRkUsR0FUb0I7QUFjbkNDLEVBQUFBLFFBQVEsRUFBRVQsTUFkeUI7QUFlbkNVLEVBQUFBLEdBQUcsRUFBRUMsSUFmOEI7QUFnQm5DQyxFQUFBQSxLQUFLLEVBQUVaLE1BaEI0QjtBQWtCbkNhLEVBQUFBLE9BQU8sRUFBRWIsTUFsQjBCO0FBbUJuQ2MsRUFBQUEsS0FBSyxFQUFFO0FBQ0hmLElBQUFBLElBQUksRUFBRUQsaUJBQU9pQixLQUFQLENBQWFDLFFBRGhCO0FBRUhDLElBQUFBLEdBQUcsRUFBRTtBQUZGLEdBbkI0QjtBQXVCbkNDLEVBQUFBLFFBQVEsRUFBRTtBQUNObkIsSUFBQUEsSUFBSSxFQUFFRCxpQkFBT2lCLEtBQVAsQ0FBYUMsUUFEYjtBQUVOQyxJQUFBQSxHQUFHLEVBQUU7QUFGQyxHQXZCeUI7QUEyQm5DRSxFQUFBQSxLQUFLLEVBQUU7QUFDSHBCLElBQUFBLElBQUksRUFBRUQsaUJBQU9pQixLQUFQLENBQWFDLFFBRGhCO0FBRUhDLElBQUFBLEdBQUcsRUFBRTtBQUZGLEdBM0I0QjtBQStCbkNHLEVBQUFBLE9BQU8sRUFBRXBCLE1BL0IwQjtBQWlDbkNxQixFQUFBQSxPQUFPLEVBQUVyQixNQWpDMEI7QUFrQ25Dc0IsRUFBQUEsY0FBYyxFQUFFdEIsTUFsQ21CO0FBb0NuQ3VCLEVBQUFBLEtBQUssRUFBRXZCLE1BcEM0QjtBQXFDbkN3QixFQUFBQSxZQUFZLEVBQUV4QixNQXJDcUI7QUF1Q25DeUIsRUFBQUEsUUFBUSxFQUFFO0FBQ04xQixJQUFBQSxJQUFJLEVBQUVRLE9BREE7QUFFTkMsSUFBQUEsT0FBTyxFQUFFO0FBRkgsR0F2Q3lCO0FBMkNuQ2tCLEVBQUFBLE9BQU8sRUFBRTtBQUNMM0IsSUFBQUEsSUFBSSxFQUFFUSxPQUREO0FBRUxDLElBQUFBLE9BQU8sRUFBRTtBQUZKLEdBM0MwQjtBQStDbkNtQixFQUFBQSxNQUFNLEVBQUU7QUFDSjVCLElBQUFBLElBQUksRUFBRVEsT0FERjtBQUVKQyxJQUFBQSxPQUFPLEVBQUU7QUFGTCxHQS9DMkI7QUFtRG5Db0IsRUFBQUEsU0FBUyxFQUFFO0FBQ1A3QixJQUFBQSxJQUFJLEVBQUVRLE9BREM7QUFFUEMsSUFBQUEsT0FBTyxFQUFFO0FBRkY7QUFuRHdCLENBQXBCLEVBdURoQjtBQUFFcUIsRUFBQUEsVUFBVSxFQUFFO0FBQWQsQ0F2RGdCLENBQW5CO0FBd0RBakMsVUFBVSxDQUFDa0MsR0FBWCxDQUFlLE1BQWYsRUFBdUIsVUFBVUMsSUFBVixFQUFnQjtBQUNuQztBQUNBLE1BQUlDLElBQUksR0FBRyxJQUFYLENBRm1DLENBR25DOztBQUNBLE1BQUksQ0FBQ0EsSUFBSSxDQUFDQyxVQUFMLENBQWdCLFVBQWhCLENBQUwsRUFDSSxPQUFPRixJQUFJLEVBQVgsQ0FMK0IsQ0FNbkM7O0FBQ0F0QyxFQUFBQSxNQUFNLENBQUN5QyxPQUFQLENBQWV2QyxnQkFBZixFQUFpQyxVQUFVd0MsR0FBVixFQUFlQyxJQUFmLEVBQXFCO0FBQ2xELFFBQUlELEdBQUosRUFDSSxPQUFPSixJQUFJLENBQUNJLEdBQUQsQ0FBWCxDQUY4QyxDQUdsRDs7QUFDQTFDLElBQUFBLE1BQU0sQ0FBQzRDLElBQVAsQ0FBWUwsSUFBSSxDQUFDdkIsUUFBakIsRUFBMkIyQixJQUEzQixFQUFpQyxVQUFVRCxHQUFWLEVBQWVFLElBQWYsRUFBcUI7QUFDbEQsVUFBSUYsR0FBSixFQUNJLE9BQU9KLElBQUksQ0FBQ0ksR0FBRCxDQUFYLENBRjhDLENBR2xEOztBQUNBSCxNQUFBQSxJQUFJLENBQUN2QixRQUFMLEdBQWdCNEIsSUFBaEI7QUFDQU4sTUFBQUEsSUFBSTtBQUNQLEtBTkQ7QUFPSCxHQVhEO0FBWUgsQ0FuQkQ7O0FBb0JBbkMsVUFBVSxDQUFDMEMsT0FBWCxDQUFtQkMsZUFBbkIsR0FBcUMsVUFBVUMsaUJBQVYsRUFBNkJDLEVBQTdCLEVBQWlDO0FBQ2xFaEQsRUFBQUEsTUFBTSxDQUFDaUQsT0FBUCxDQUFlRixpQkFBZixFQUFrQyxLQUFLL0IsUUFBdkMsRUFBaUQsVUFBVTBCLEdBQVYsRUFBZVEsT0FBZixFQUF3QjtBQUNyRSxRQUFJUixHQUFKLEVBQ0ksT0FBT00sRUFBRSxDQUFDTixHQUFELENBQVQ7QUFDSk0sSUFBQUEsRUFBRSxDQUFDLElBQUQsRUFBT0UsT0FBUCxDQUFGO0FBQ0gsR0FKRDtBQUtILENBTkQ7O0FBT0EsTUFBTUMsU0FBUyxHQUFHL0Msa0JBQVNnRCxLQUFULENBQWUsTUFBZixFQUF1QmpELFVBQXZCLENBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5jb25zdCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHRqcycpLCBTQUxUX1dPUktfRkFDVE9SID0gMTA7XHJcblxyXG5cclxuY29uc3QgVXNlclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgdHlwZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBlbnVtOiBbJ3N1cGVyQWRtaW4nLCAnc3RhdGVBZG1pbicsICdkaXN0cmljdEFkbWluJywgJ3RhbHVrQWRtaW4nXSxcclxuICAgIH0sXHJcbiAgICBmaXJzdE5hbWU6IFN0cmluZyxcclxuICAgIGxhc3ROYW1lOiBTdHJpbmcsXHJcbiAgICBwaG9uZU5vOiBTdHJpbmcsXHJcbiAgICBlbWFpbDogU3RyaW5nLFxyXG4gICAgZW1haWxWZXJpZmllZDogeyBcclxuICAgICAgICB0eXBlOiBCb29sZWFuLCBcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZSBcclxuICAgIH0sXHJcblxyXG4gICAgcGFzc3dvcmQ6IFN0cmluZyxcclxuICAgIGRvYjogRGF0ZSxcclxuICAgIHBob3RvOiBTdHJpbmcsXHJcblxyXG4gICAgYWRkcmVzczogU3RyaW5nLFxyXG4gICAgc3RhdGU6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcInN0YXRlXCIsXHJcbiAgICB9LFxyXG4gICAgZGlzdHJpY3Q6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcImRpc3RyaWN0XCIsXHJcbiAgICB9LFxyXG4gICAgdGFsdWs6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcInRhbHVrXCIsXHJcbiAgICB9LFxyXG4gICAgemlwY29kZTogU3RyaW5nLFxyXG5cclxuICAgIGFkaGFyTm86IFN0cmluZyxcclxuICAgIGFkaGFyQ2FyZFBob3RvOiBTdHJpbmcsXHJcblxyXG4gICAgcGFuTm86IFN0cmluZyxcclxuICAgIHBhbkNhcmRQaG90bzogU3RyaW5nLFxyXG5cclxuICAgIGlzQWN0aXZlOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGlzQWRtaW46IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgaXNTdGFmOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGlzRGVsZXRlZDoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH1cclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5Vc2VyU2NoZW1hLnByZSgnc2F2ZScsIGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAvLyB2YXIgb3RwID0gTWF0aC5mbG9vcigxMDAwMCArIE1hdGgucmFuZG9tKCkgKiA5MDAwMDApO1xyXG4gICAgdmFyIHVzZXIgPSB0aGlzO1xyXG4gICAgLy8gb25seSBoYXNoIHRoZSBwYXNzd29yZCBpZiBpdCBoYXMgYmVlbiBtb2RpZmllZCAob3IgaXMgbmV3KVxyXG4gICAgaWYgKCF1c2VyLmlzTW9kaWZpZWQoJ3Bhc3N3b3JkJykpXHJcbiAgICAgICAgcmV0dXJuIG5leHQoKTtcclxuICAgIC8vIGdlbmVyYXRlIGEgc2FsdFxyXG4gICAgYmNyeXB0LmdlblNhbHQoU0FMVF9XT1JLX0ZBQ1RPUiwgZnVuY3Rpb24gKGVyciwgc2FsdCkge1xyXG4gICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0KGVycik7XHJcbiAgICAgICAgLy8gaGFzaCB0aGUgcGFzc3dvcmQgdXNpbmcgb3VyIG5ldyBzYWx0XHJcbiAgICAgICAgYmNyeXB0Lmhhc2godXNlci5wYXNzd29yZCwgc2FsdCwgZnVuY3Rpb24gKGVyciwgaGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcclxuICAgICAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIGNsZWFydGV4dCBwYXNzd29yZCB3aXRoIHRoZSBoYXNoZWQgb25lXHJcbiAgICAgICAgICAgIHVzZXIucGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcblVzZXJTY2hlbWEubWV0aG9kcy5jb21wYXJlUGFzc3dvcmQgPSBmdW5jdGlvbiAoY2FuZGlkYXRlUGFzc3dvcmQsIGNiKSB7XHJcbiAgICBiY3J5cHQuY29tcGFyZShjYW5kaWRhdGVQYXNzd29yZCwgdGhpcy5wYXNzd29yZCwgZnVuY3Rpb24gKGVyciwgaXNNYXRjaCkge1xyXG4gICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xyXG4gICAgICAgIGNiKG51bGwsIGlzTWF0Y2gpO1xyXG4gICAgfSk7XHJcbn07XHJcbmNvbnN0IFVzZXJNb2RlbCA9IG1vbmdvb3NlLm1vZGVsKCd1c2VyJywgVXNlclNjaGVtYSk7XHJcbmV4cG9ydCB7IFVzZXJNb2RlbCB9OyJdfQ==