"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const WalletSchema = new _mongoose.Schema({
  driver: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "driver" // unique: true

  },
  amount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const WalletModel = _mongoose.default.model('wallet', WalletSchema);

var _default = WalletModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldC5qcyJdLCJuYW1lcyI6WyJXYWxsZXRTY2hlbWEiLCJTY2hlbWEiLCJkcml2ZXIiLCJ0eXBlIiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsImFtb3VudCIsIk51bWJlciIsImRlZmF1bHQiLCJ0aW1lc3RhbXBzIiwiV2FsbGV0TW9kZWwiLCJtb25nb29zZSIsIm1vZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVBLE1BQU1BLFlBQVksR0FBRyxJQUFJQyxnQkFBSixDQUFXO0FBQzVCQyxFQUFBQSxNQUFNLEVBQUU7QUFDSkMsSUFBQUEsSUFBSSxFQUFFRixpQkFBT0csS0FBUCxDQUFhQyxRQURmO0FBRUpDLElBQUFBLEdBQUcsRUFBRSxRQUZELENBR0o7O0FBSEksR0FEb0I7QUFNNUJDLEVBQUFBLE1BQU0sRUFBRTtBQUNKSixJQUFBQSxJQUFJLEVBQUVLLE1BREY7QUFFSkMsSUFBQUEsT0FBTyxFQUFFO0FBRkw7QUFOb0IsQ0FBWCxFQVVsQjtBQUFFQyxFQUFBQSxVQUFVLEVBQUU7QUFBZCxDQVZrQixDQUFyQjs7QUFZQSxNQUFNQyxXQUFXLEdBQUdDLGtCQUFTQyxLQUFULENBQWUsUUFBZixFQUF5QmIsWUFBekIsQ0FBcEI7O2VBQ2VXLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UsIHtTY2hlbWF9IGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IFdhbGxldFNjaGVtYSA9IG5ldyBTY2hlbWEoe1xyXG4gICAgZHJpdmVyOiB7XHJcbiAgICAgICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogXCJkcml2ZXJcIixcclxuICAgICAgICAvLyB1bmlxdWU6IHRydWVcclxuICAgIH0sXHJcbiAgICBhbW91bnQ6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5cclxuY29uc3QgV2FsbGV0TW9kZWwgPSBtb25nb29zZS5tb2RlbCgnd2FsbGV0JywgV2FsbGV0U2NoZW1hKTtcclxuZXhwb3J0IGRlZmF1bHQgV2FsbGV0TW9kZWw7Il19