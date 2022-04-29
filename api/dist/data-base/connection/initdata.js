"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initdata;

var _state = _interopRequireDefault(require("../models/state"));

var _district = _interopRequireDefault(require("../models/district"));

var _taluk = _interopRequireDefault(require("../models/taluk"));

var _serviceType = _interopRequireDefault(require("../models/serviceType"));

var _adminModules = _interopRequireDefault(require("../models/adminModules"));

var _rideTypeModel = _interopRequireDefault(require("../models/rideTypeModel"));

var _statesDistrictsAndTaluks = _interopRequireDefault(require("../initdata/statesDistrictsAndTaluks"));

var _serviceTypes = _interopRequireDefault(require("../initdata/serviceTypes"));

var _adminModules2 = _interopRequireDefault(require("../initdata/adminModules"));

var _rideType = _interopRequireDefault(require("../initdata/rideType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function initdata() {
  let resultState = await _state.default.findOne(),
      resultDistrict,
      resultTaluk;

  if (!resultState) {
    _statesDistrictsAndTaluks.default?.map(async state => {
      resultState = new _state.default();
      resultState.name = state.name;
      resultState.save((errVS, vs) => {
        if (!errVS) {
          state?.districts?.forEach(async district => {
            resultDistrict = new _district.default();
            resultDistrict.name = district.name;
            resultDistrict.state = vs._id;
            await resultDistrict.save((errVD, vd) => {
              if (!errVD) {
                district?.taluks.forEach(async vt => {
                  resultTaluk = new _taluk.default();
                  resultTaluk.name = vt;
                  resultTaluk.district = vd._id;
                  await resultTaluk.save();
                });
              }
            });
          });
        }
      });
    });
  }

  let resultServiceTypes = await _serviceType.default.findOne();

  if (!resultServiceTypes) {
    _serviceTypes.default?.map(async st => {
      resultServiceTypes = new _serviceType.default();
      resultServiceTypes.name = st.name;
      resultServiceTypes.key = st.key;
      await resultServiceTypes.save();
    });
  }

  let resultUserTypePermission = await _adminModules.default.findOne();

  if (!resultUserTypePermission) {
    _adminModules2.default?.map(async utp => {
      resultUserTypePermission = new _adminModules.default();
      resultUserTypePermission.typeName = utp.typeName;
      resultUserTypePermission.typeKey = utp.typeKey;
      resultUserTypePermission.grantedModules = utp.grantedModules;
      await resultUserTypePermission.save();
    });
  }

  let rideTypeResult = _rideTypeModel.default.findOne();

  if (rideTypeResult) {
    const cargoId = await _serviceType.default.findOne({
      key: 'cargo'
    });
    const taxiId = await _serviceType.default.findOne({
      key: 'taxi'
    });

    _rideType.default.forEach(async v => {
      rideTypeResult = new _rideTypeModel.default();
      rideTypeResult.name = v.name;
      rideTypeResult.key = v.key;

      if (v.serviceType === 'cargo') {
        rideTypeResult.serviceType = cargoId;
      } else if (v.serviceType === 'taxi') {
        rideTypeResult.serviceType = taxiId;
      }

      await rideTypeResult.save();
    });
  }
}