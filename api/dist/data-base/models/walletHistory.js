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