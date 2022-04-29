"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _modue = _interopRequireDefault(require("../models/modue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createModules = async () => {
  _mongoose.default.modelNames()?.forEach(async v => {
    v = v.replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    v = v.charAt(0).toUpperCase() + v.slice(1);
    v = v.match(/[A-Z][a-z]+/g).join(" ");
    await _modue.default.deleteMany();
    const dt = [{
      title: "Add " + v,
      key: 'add' + v.replaceAll(' ', '')
    }, {
      title: "Edit " + v,
      key: 'edit' + v.replaceAll(' ', '')
    }, {
      title: "View " + v,
      key: 'view' + v.replaceAll(' ', '')
    }, {
      title: "Delete " + v,
      key: 'delete' + v.replaceAll(' ', '')
    }];
    await _modue.default.insertMany(dt);
  });
};

var _default = createModules;
exports.default = _default;