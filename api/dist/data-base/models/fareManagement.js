"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const FareManagementSchema = new _mongoose.default.Schema({
  serviceType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  rideType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "rideType"
  },
  vehicleCategory: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "vehicleCategory"
  },
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
  baseFare: {
    type: Number,
    default: 0
  },
  bookingFare: {
    type: Number,
    default: 0
  },
  perMinuteFare: Number,
  cancelCharge: {
    type: Number,
    default: 0
  },
  waitingCharge: {
    type: Number,
    default: 0
  },
  adminCommissionType: {
    type: String,
    enum: ['percentage', 'flat'],
    default: 'percentage'
  },
  adminCommissionValue: {
    type: Number,
    default: 10
  },
  perKMCharges: [{
    maxKM: Number,
    charge: Number
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const FareManagementModel = _mongoose.default.model('fareManagement', FareManagementSchema);

var _default = FareManagementModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL2ZhcmVNYW5hZ2VtZW50LmpzIl0sIm5hbWVzIjpbIkZhcmVNYW5hZ2VtZW50U2NoZW1hIiwibW9uZ29vc2UiLCJTY2hlbWEiLCJzZXJ2aWNlVHlwZSIsInR5cGUiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwicmlkZVR5cGUiLCJ2ZWhpY2xlQ2F0ZWdvcnkiLCJzdGF0ZSIsImRpc3RyaWN0IiwidGFsdWsiLCJiYXNlRmFyZSIsIk51bWJlciIsImRlZmF1bHQiLCJib29raW5nRmFyZSIsInBlck1pbnV0ZUZhcmUiLCJjYW5jZWxDaGFyZ2UiLCJ3YWl0aW5nQ2hhcmdlIiwiYWRtaW5Db21taXNzaW9uVHlwZSIsIlN0cmluZyIsImVudW0iLCJhZG1pbkNvbW1pc3Npb25WYWx1ZSIsInBlcktNQ2hhcmdlcyIsIm1heEtNIiwiY2hhcmdlIiwiaXNEZWxldGVkIiwiQm9vbGVhbiIsInRpbWVzdGFtcHMiLCJGYXJlTWFuYWdlbWVudE1vZGVsIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsTUFBTUEsb0JBQW9CLEdBQUcsSUFBSUMsa0JBQVNDLE1BQWIsQ0FBb0I7QUFDN0NDLEVBQUFBLFdBQVcsRUFBRTtBQUNUQyxJQUFBQSxJQUFJLEVBQUVGLGlCQUFPRyxLQUFQLENBQWFDLFFBRFY7QUFFVEMsSUFBQUEsR0FBRyxFQUFFO0FBRkksR0FEZ0M7QUFLN0NDLEVBQUFBLFFBQVEsRUFBRTtBQUNOSixJQUFBQSxJQUFJLEVBQUVGLGlCQUFPRyxLQUFQLENBQWFDLFFBRGI7QUFFTkMsSUFBQUEsR0FBRyxFQUFFO0FBRkMsR0FMbUM7QUFTN0NFLEVBQUFBLGVBQWUsRUFBRTtBQUNiTCxJQUFBQSxJQUFJLEVBQUVGLGlCQUFPRyxLQUFQLENBQWFDLFFBRE47QUFFYkMsSUFBQUEsR0FBRyxFQUFFO0FBRlEsR0FUNEI7QUFhN0NHLEVBQUFBLEtBQUssRUFBRTtBQUNITixJQUFBQSxJQUFJLEVBQUVGLGlCQUFPRyxLQUFQLENBQWFDLFFBRGhCO0FBRUhDLElBQUFBLEdBQUcsRUFBRTtBQUZGLEdBYnNDO0FBaUI3Q0ksRUFBQUEsUUFBUSxFQUFFO0FBQ05QLElBQUFBLElBQUksRUFBRUYsaUJBQU9HLEtBQVAsQ0FBYUMsUUFEYjtBQUVOQyxJQUFBQSxHQUFHLEVBQUU7QUFGQyxHQWpCbUM7QUFxQjdDSyxFQUFBQSxLQUFLLEVBQUU7QUFDSFIsSUFBQUEsSUFBSSxFQUFFRixpQkFBT0csS0FBUCxDQUFhQyxRQURoQjtBQUVIQyxJQUFBQSxHQUFHLEVBQUU7QUFGRixHQXJCc0M7QUEwQjdDTSxFQUFBQSxRQUFRLEVBQUU7QUFDTlQsSUFBQUEsSUFBSSxFQUFFVSxNQURBO0FBRU5DLElBQUFBLE9BQU8sRUFBRTtBQUZILEdBMUJtQztBQThCN0NDLEVBQUFBLFdBQVcsRUFBRTtBQUNUWixJQUFBQSxJQUFJLEVBQUVVLE1BREc7QUFFVEMsSUFBQUEsT0FBTyxFQUFFO0FBRkEsR0E5QmdDO0FBa0M3Q0UsRUFBQUEsYUFBYSxFQUFFSCxNQWxDOEI7QUFtQzdDSSxFQUFBQSxZQUFZLEVBQUU7QUFDVmQsSUFBQUEsSUFBSSxFQUFFVSxNQURJO0FBRVZDLElBQUFBLE9BQU8sRUFBRTtBQUZDLEdBbkMrQjtBQXVDN0NJLEVBQUFBLGFBQWEsRUFBRTtBQUNYZixJQUFBQSxJQUFJLEVBQUVVLE1BREs7QUFFWEMsSUFBQUEsT0FBTyxFQUFFO0FBRkUsR0F2QzhCO0FBMkM3Q0ssRUFBQUEsbUJBQW1CLEVBQUU7QUFDakJoQixJQUFBQSxJQUFJLEVBQUVpQixNQURXO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUUsQ0FBQyxZQUFELEVBQWUsTUFBZixDQUZXO0FBR2pCUCxJQUFBQSxPQUFPLEVBQUU7QUFIUSxHQTNDd0I7QUFpRDdDUSxFQUFBQSxvQkFBb0IsRUFBRTtBQUNsQm5CLElBQUFBLElBQUksRUFBRVUsTUFEWTtBQUVsQkMsSUFBQUEsT0FBTyxFQUFFO0FBRlMsR0FqRHVCO0FBcUQ3Q1MsRUFBQUEsWUFBWSxFQUFFLENBQUM7QUFDWEMsSUFBQUEsS0FBSyxFQUFFWCxNQURJO0FBRVhZLElBQUFBLE1BQU0sRUFBRVo7QUFGRyxHQUFELENBckQrQjtBQXlEN0NhLEVBQUFBLFNBQVMsRUFBRTtBQUNQdkIsSUFBQUEsSUFBSSxFQUFFd0IsT0FEQztBQUVQYixJQUFBQSxPQUFPLEVBQUU7QUFGRjtBQXpEa0MsQ0FBcEIsRUE2RDFCO0FBQUVjLEVBQUFBLFVBQVUsRUFBRTtBQUFkLENBN0QwQixDQUE3Qjs7QUFnRUEsTUFBTUMsbUJBQW1CLEdBQUc3QixrQkFBUzhCLEtBQVQsQ0FBZSxnQkFBZixFQUFpQy9CLG9CQUFqQyxDQUE1Qjs7ZUFDZThCLG1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5cclxuY29uc3QgRmFyZU1hbmFnZW1lbnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgIHNlcnZpY2VUeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogXCJzZXJ2aWNlVHlwZVwiLFxyXG4gICAgfSxcclxuICAgIHJpZGVUeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogXCJyaWRlVHlwZVwiLFxyXG4gICAgfSxcclxuICAgIHZlaGljbGVDYXRlZ29yeToge1xyXG4gICAgICAgIHR5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCxcclxuICAgICAgICByZWY6IFwidmVoaWNsZUNhdGVnb3J5XCIsXHJcbiAgICB9LFxyXG4gICAgc3RhdGU6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcInN0YXRlXCIsXHJcbiAgICB9LFxyXG4gICAgZGlzdHJpY3Q6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcImRpc3RyaWN0XCIsXHJcbiAgICB9LFxyXG4gICAgdGFsdWs6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcInRhbHVrXCIsXHJcbiAgICB9LFxyXG5cclxuICAgIGJhc2VGYXJlOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBib29raW5nRmFyZToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgcGVyTWludXRlRmFyZTogTnVtYmVyLFxyXG4gICAgY2FuY2VsQ2hhcmdlOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICB3YWl0aW5nQ2hhcmdlOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICBhZG1pbkNvbW1pc3Npb25UeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGVudW06IFsncGVyY2VudGFnZScsICdmbGF0J10sXHJcbiAgICAgICAgZGVmYXVsdDogJ3BlcmNlbnRhZ2UnXHJcbiAgICB9LFxyXG5cclxuICAgIGFkbWluQ29tbWlzc2lvblZhbHVlOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIGRlZmF1bHQ6IDEwXHJcbiAgICB9LFxyXG4gICAgcGVyS01DaGFyZ2VzOiBbe1xyXG4gICAgICAgIG1heEtNOiBOdW1iZXIsXHJcbiAgICAgICAgY2hhcmdlOiBOdW1iZXJcclxuICAgIH1dLFxyXG4gICAgaXNEZWxldGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfVxyXG59LCB7IHRpbWVzdGFtcHM6IHRydWUgfSk7XHJcblxyXG5cclxuY29uc3QgRmFyZU1hbmFnZW1lbnRNb2RlbCA9IG1vbmdvb3NlLm1vZGVsKCdmYXJlTWFuYWdlbWVudCcsIEZhcmVNYW5hZ2VtZW50U2NoZW1hKTtcclxuZXhwb3J0IGRlZmF1bHQgRmFyZU1hbmFnZW1lbnRNb2RlbDsiXX0=