"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const WalletHistorySchema = new _mongoose.Schema({
  wallet: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "wallet"
  },
  transactionId: {
    type: Number,
    unique: true
  },
  transactionType: {
    type: String,
    enum: ['debit', 'credit']
  },
  transactionMethod: {
    type: String,
    enum: ['byAdmin', 'paytm']
  },
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'failed', 'completed']
  },
  description: String
}, {
  timestamps: true
});

const WalletHistoryModel = _mongoose.default.model('walletHistory', WalletHistorySchema);

var _default = WalletHistoryModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldEhpc3RvcnkuanMiXSwibmFtZXMiOlsiV2FsbGV0SGlzdG9yeVNjaGVtYSIsIlNjaGVtYSIsIndhbGxldCIsInR5cGUiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwidHJhbnNhY3Rpb25JZCIsIk51bWJlciIsInVuaXF1ZSIsInRyYW5zYWN0aW9uVHlwZSIsIlN0cmluZyIsImVudW0iLCJ0cmFuc2FjdGlvbk1ldGhvZCIsImFtb3VudCIsInN0YXR1cyIsImRlc2NyaXB0aW9uIiwidGltZXN0YW1wcyIsIldhbGxldEhpc3RvcnlNb2RlbCIsIm1vbmdvb3NlIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsTUFBTUEsbUJBQW1CLEdBQUcsSUFBSUMsZ0JBQUosQ0FBVztBQUNuQ0MsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLElBQUksRUFBRUYsaUJBQU9HLEtBQVAsQ0FBYUMsUUFEZjtBQUVKQyxJQUFBQSxHQUFHLEVBQUU7QUFGRCxHQUQyQjtBQUtuQ0MsRUFBQUEsYUFBYSxFQUFFO0FBQ1hKLElBQUFBLElBQUksRUFBRUssTUFESztBQUVYQyxJQUFBQSxNQUFNLEVBQUU7QUFGRyxHQUxvQjtBQVNuQ0MsRUFBQUEsZUFBZSxFQUFFO0FBQ2JQLElBQUFBLElBQUksRUFBRVEsTUFETztBQUViQyxJQUFBQSxJQUFJLEVBQUUsQ0FBQyxPQUFELEVBQVUsUUFBVjtBQUZPLEdBVGtCO0FBYW5DQyxFQUFBQSxpQkFBaUIsRUFBRTtBQUNmVixJQUFBQSxJQUFJLEVBQUVRLE1BRFM7QUFFZkMsSUFBQUEsSUFBSSxFQUFFLENBQUMsU0FBRCxFQUFZLE9BQVo7QUFGUyxHQWJnQjtBQWlCbkNFLEVBQUFBLE1BQU0sRUFBRU4sTUFqQjJCO0FBa0JuQ08sRUFBQUEsTUFBTSxFQUFFO0FBQ0paLElBQUFBLElBQUksRUFBRVEsTUFERjtBQUVKQyxJQUFBQSxJQUFJLEVBQUUsQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixXQUF0QjtBQUZGLEdBbEIyQjtBQXNCbkNJLEVBQUFBLFdBQVcsRUFBRUw7QUF0QnNCLENBQVgsRUF1QnpCO0FBQUVNLEVBQUFBLFVBQVUsRUFBRTtBQUFkLENBdkJ5QixDQUE1Qjs7QUF5QkEsTUFBTUMsa0JBQWtCLEdBQUdDLGtCQUFTQyxLQUFULENBQWUsZUFBZixFQUFnQ3BCLG1CQUFoQyxDQUEzQjs7ZUFDZWtCLGtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBXYWxsZXRIaXN0b3J5U2NoZW1hID0gbmV3IFNjaGVtYSh7XHJcbiAgICB3YWxsZXQ6IHtcclxuICAgICAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgcmVmOiBcIndhbGxldFwiLFxyXG4gICAgfSxcclxuICAgIHRyYW5zYWN0aW9uSWQ6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgdW5pcXVlOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgdHJhbnNhY3Rpb25UeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGVudW06IFsnZGViaXQnLCAnY3JlZGl0J10sXHJcbiAgICB9LFxyXG4gICAgdHJhbnNhY3Rpb25NZXRob2Q6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgZW51bTogWydieUFkbWluJywgJ3BheXRtJ11cclxuICAgIH0sXHJcbiAgICBhbW91bnQ6IE51bWJlcixcclxuICAgIHN0YXR1czoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBlbnVtOiBbJ3BlbmRpbmcnLCAnZmFpbGVkJywgJ2NvbXBsZXRlZCddLFxyXG4gICAgfSxcclxuICAgIGRlc2NyaXB0aW9uOiBTdHJpbmdcclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5cclxuY29uc3QgV2FsbGV0SGlzdG9yeU1vZGVsID0gbW9uZ29vc2UubW9kZWwoJ3dhbGxldEhpc3RvcnknLCBXYWxsZXRIaXN0b3J5U2NoZW1hKTtcclxuZXhwb3J0IGRlZmF1bHQgV2FsbGV0SGlzdG9yeU1vZGVsOyJdfQ==