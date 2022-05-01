"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vehicle = _interopRequireDefault(require("../data-base/models/vehicle"));

var _helper = require("../utls/_helper");

var _config = _interopRequireDefault(require("../utls/config"));

var _vehicaleCategoryModel = _interopRequireDefault(require("../data-base/models/vehicaleCategoryModel"));

var _color = _interopRequireDefault(require("../data-base/models/color"));

var _make = _interopRequireDefault(require("../data-base/models/make"));

var _makeModel = _interopRequireDefault(require("../data-base/models/makeModel"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  /*
  static async ownerLogin(data) {
      const response = { statusCode: 400, message: 'Error!', status: false };
      const email = data.email;
      const password = data.password;
        try {
          const owner = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
          let isPasswordMatched = await bcrypt.compare(password, owner.password);
          if (!isPasswordMatched) {
              throw new Error("Invalid Credentials");
          } else {
              const JWT_EXP_DUR = config.jwt.expDuration;
              const accessToken = jwt.sign({ sub: owner._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);
                if (!owner.emailVerfied) {
                  response.statusCode = 401;
                  response.message = "Email is not verified. Please verify from the link sent to your email!!";
              } else if (!owner.isActive) {
                  response.statusCode = 401;
                  response.message = "Your acount is blocked. Please contact admin";
              } else {
                  response.statusCode = 200;
                  response.status = true;
                  response.message = "Loggedin successfully";
                    response.data = { accessToken };
              }
          }
      } catch (e) {
          throw new Error(e.message);
      }
        return response;
  }
  static async ownerVerifyEmail(email) {
      const response = { statusCode: 400, message: 'Error!', status: false };
        try {
          const owner = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
          if (owner) {
              if (owner.emailVerfied) {
                  response.message = "Email is already verified";
              } else {
                  owner.emailVerfied = true;
                  await owner.save();
                  response.message = "Email is verified";
              }
              response.statusCode = 200;
              response.status = true;
          } else {
              throw new Error("Invalid path");
          }
      } catch (e) {
          throw new Error(e.message);
      }
        return response;
  }
  static async ownerGenForgetPasswordUrl(email) {
      const response = { statusCode: 400, message: 'Error!', status: false };
      try {
          const tplData = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
          if (tplData) {
              const timeStamp = new Date().getTime() + config.forgetPassExpTime * 60 * 1000;
              const encKey = encryptData(encryptData(timeStamp + '-----' + email));
              await sendResetPasswordMail({ key: encKey, email: email, validFor: config.forgetPassExpTime });
              response.message = "A reset password link has been sent to your email. Please check and reset your password.";
              response.statusCode = 200;
              response.status = true;
          } else {
              throw new Error("This email is not registered with any account");
          }
      } catch (e) {
          throw new Error(e.message);
      }
      return response;
  }
  static async ownerResetPAssword(key, data) {
      const response = { statusCode: 400, message: 'Error!', status: false };
      try {
          const decKey = decryptData(decryptData(key));
          const timeStamp = decKey.split('-----')[0];
          const email = decKey.split('-----')[1];
          const cTimeStamp = new Date().getTime();
            const tplData = await VehicleOwnerModel.findOne({ email, isDeleted: false });
            if (timeStamp >= cTimeStamp) {
              if (tplData) {
                  tplData.password = data.password;
                  await tplData.save();
                  response.message = "Password is updated. Try login aganin";
                  response.statusCode = 200;
                  response.status = true;
              }
          } else {
              response.message = "Time expired";
          }
          return response;
      } catch (e) {
          throw new Error(e)
      }
  }
  */
  static async listColor(query, params) {
    const isAll = params.isAll === 'ALL';
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        total: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isDeleted: false,
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          code: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          name: 1,
          code: 1,
          isActive: 1
        }
      }];
      const counter = await _color.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _color.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveColor(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _color.default.findById(_id) : new _color.default();
      tplData.name = data.name;
      tplData.code = data.code;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Color is Updated" : "A new color is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteColor(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _color.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async listMake(query, params) {
    const isAll = params.isAll === 'ALL';
    const withModels = query?.models == 1;
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        total: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isActive: query?.active ? query.active === '1' : '',
        isDeleted: false,
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          key: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          name: 1,
          key: 1,
          isActive: 1,
          models: 1
        }
      }];

      if (withModels) {
        const modelSearch = {
          isActive: query?.modelActive ? query.modelActive === '1' : '',
          isDeleted: false
        };
        (0, _helper.clearSearch)(modelSearch);
        $aggregate.push({
          $lookup: {
            from: 'makemodels',
            localField: '_id',
            foreignField: 'make',
            as: 'models',
            pipeline: [{
              $match: modelSearch
            }, {
              $project: {
                name: 1
              }
            }]
          }
        });
      }

      const counter = await _make.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _make.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveMake(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _make.default.findById(_id) : new _make.default();
      tplData.name = data.name;
      tplData.key = data.key;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Make is Updated" : "A new make is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteMake(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _make.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async listMakeModel(query, params) {
    const isAll = params.isAll === 'ALL';
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        total: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isDeleted: false,
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          key: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        $lookup: {
          from: 'makes',
          localField: 'make',
          foreignField: '_id',
          as: 'makeDetails',
          pipeline: [{
            "$project": {
              name: 1,
              key: 1
            }
          }]
        }
      }, {
        $unwind: "$makeDetails"
      }, {
        "$project": {
          make: 1,
          name: 1,
          key: 1,
          makeDetails: 1,
          isActive: 1
        }
      }];
      const counter = await _makeModel.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _makeModel.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveMakeModel(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _makeModel.default.findById(_id) : new _makeModel.default();
      tplData.make = data.make;
      tplData.name = data.name;
      tplData.key = data.key;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Make model is Updated" : "A new make model is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteMakeModel(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _makeModel.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async listVehicleCategory(query, params) {
    const isAll = params.isAll === 'ALL';
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        total: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isDeleted: false,
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          slug: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }],
        serviceType: query.serviceType ? _mongoose.default.Types.ObjectId(query.serviceType) : ''
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        $lookup: {
          from: 'servicetypes',
          localField: 'serviceType',
          foreignField: '_id',
          as: 'serviceTypeDetails',
          pipeline: [{
            $project: {
              name: 1,
              key: 1
            }
          }]
        }
      }, {
        $unwind: "$serviceTypeDetails"
      }, {
        "$project": {
          serviceType: 1,
          serviceTypeDetails: 1,
          name: 1,
          slug: 1,
          isActive: 1,
          image: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/category/', "$photo"]
            },
            name: "$photo"
          }
        }
      }];
      const counter = await _vehicaleCategoryModel.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _vehicaleCategoryModel.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveVehicleCategory(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _vehicaleCategoryModel.default.findById(_id) : new _vehicaleCategoryModel.default();
      tplData.serviceType = data.serviceType;
      tplData.name = data.name;
      tplData.slug = data.slug;
      tplData.photo = await (0, _helper.uploadFile)(data.photo, _config.default.uploadPaths.vehicle.category, _vehicaleCategoryModel.default, 'photo', _id);
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Vehicle category is Updated" : "A new vehicle category is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteVehicleCategory(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _vehicaleCategoryModel.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async listVehicle(query, params) {
    const isAll = params.isAll === 'ALL';
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        total: 0
      },
      status: false
    };

    try {
      query.key = typeof parseInt(query.key) === 'number' && !isNaN(parseInt(query.key)) ? parseInt(query.key) : query.key;

      const search = _objectSpread({
        _id: query._id,
        isDeleted: false,
        $or: [{
          name: typeof query.key === 'string' ? {
            $regex: '.*' + (query?.key || '') + '.*'
          } : ''
        }, {
          vehicleNumber: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }],
        vehicleId: typeof query.key === 'number' ? query.key : '',
        serviceType: query.serviceType ? _mongoose.default.Types.ObjectId(query.serviceType) : ''
      }, (0, _helper.getAdminFilter)());

      (0, _helper.clearSearch)(search);
      const driverSearch = {
        isApproved: query.driverApproved == 'true' ? true : query.driverApproved == 'false' ? false : ''
      };
      (0, _helper.clearSearch)(driverSearch);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        $lookup: {
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'stateDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$stateDetails"
      }, {
        $lookup: {
          from: 'districts',
          localField: 'district',
          foreignField: '_id',
          as: 'districtDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$districtDetails"
      }, {
        $lookup: {
          from: 'taluks',
          localField: 'taluk',
          foreignField: '_id',
          as: 'talukDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$talukDetails"
      }, {
        $lookup: {
          from: 'drivers',
          localField: '_id',
          foreignField: 'vehicle',
          as: 'driverDetails',
          pipeline: [{
            $match: driverSearch
          }, {
            $project: {
              isApproved: 1
            }
          }]
        }
      }, {
        $unwind: {
          path: "$driverDetails",
          preserveNullAndEmptyArrays: typeof query.driverApproved == 'undefined'
        }
      }, {
        "$project": {
          vehicleId: 1,
          serviceType: 1,
          rideTypes: 1,
          vehicleCategory: 1,
          state: 1,
          district: 1,
          taluk: 1,
          make: 1,
          model: 1,
          color: 1,
          name: 1,
          vehicleNumber: 1,
          availableSeats: 1,
          availableCapacity: 1,
          manufacturingYear: 1,
          isActive: 1,
          // otherPhotos: 1,
          image: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/photo/', "$primaryPhoto"]
            },
            name: "$primaryPhoto"
          },
          otherPhotos: {
            $map: {
              input: "$otherPhotos",
              as: "images",
              in: {
                url: {
                  $concat: [_config.default.applicationFileUrl + 'vehicle/photo/', "$$images"]
                },
                name: "$$images"
              }
            }
          },
          registrationNumber: 1,
          registrationExpiryDate: 1,
          registrationPhoto: 1,
          registrationImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/document/', "$registrationPhoto"]
            },
            name: "$primaryPhoto"
          },
          insuranceNumber: 1,
          insuranceExpiryDate: 1,
          insurancePhoto: 1,
          insuranceImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/document/', "$insurancePhoto"]
            },
            name: "$primaryPhoto"
          },
          permitNumber: 1,
          permitExpiryDate: 1,
          permitPhoto: 1,
          permitImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/document/', "$permitPhoto"]
            },
            name: "$primaryPhoto"
          },
          pollutionNumber: 1,
          pollutionExpiryDate: 1,
          pollutionPhoto: 1,
          pollutionImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'vehicle/document/', "$pollutionPhoto"]
            },
            name: "$primaryPhoto"
          },
          addedBy: 1,
          createdAt: 1,
          stateDetails: 1,
          districtDetails: 1,
          talukDetails: 1,
          driverDetails: 1
        }
      }];
      const counter = await _vehicle.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _vehicle.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveVehicle(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _vehicle.default.findById(_id) : new _vehicle.default();
      tplData.vehicleId = data.vehicleId;
      tplData.serviceType = data.serviceType;
      tplData.rideTypes = data.rideTypes;
      tplData.vehicleCategory = data.vehicleCategory;
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.taluk = data.taluk;
      tplData.make = data.make;
      tplData.model = data.model;
      tplData.color = data.color;
      tplData.name = data.name;
      tplData.vehicleNumber = data.vehicleNumber;
      tplData.availableSeats = data.availableSeats;
      tplData.availableCapacity = data.availableCapacity;
      tplData.manufacturingYear = data.manufacturingYear;
      tplData.primaryPhoto = await (0, _helper.uploadFile)(data.primaryPhoto, _config.default.uploadPaths.vehicle.photo, _vehicle.default, 'primaryPhoto', _id);
      tplData.otherPhotos = await (0, _helper.uploadMultipleFile)(data.otherPhotos, _config.default.uploadPaths.vehicle.photo, _vehicle.default, 'otherPhotos', _id, data.deletingFiles);
      tplData.registrationNumber = data.registrationNumber;
      tplData.registrationExpiryDate = data.registrationExpiryDate;
      tplData.registrationPhoto = await (0, _helper.uploadFile)(data.registrationPhoto, _config.default.uploadPaths.vehicle.document, _vehicle.default, 'registrationPhoto', _id);
      tplData.insuranceNumber = data.insuranceNumber;
      tplData.insuranceExpiryDate = data.insuranceExpiryDate;
      tplData.insurancePhoto = await (0, _helper.uploadFile)(data.insurancePhoto, _config.default.uploadPaths.vehicle.document, _vehicle.default, 'insurancePhoto', _id);
      tplData.permitNumber = data.permitNumber;
      tplData.permitExpiryDate = data.permitExpiryDate;
      tplData.permitPhoto = await (0, _helper.uploadFile)(data.permitPhoto, _config.default.uploadPaths.vehicle.document, _vehicle.default, 'permitPhoto', _id);
      tplData.pollutionNumber = data.pollutionNumber;
      tplData.pollutionExpiryDate = data.pollutionExpiryDate;
      tplData.pollutionPhoto = await (0, _helper.uploadFile)(data.pollutionPhoto, _config.default.uploadPaths.vehicle.document, _vehicle.default, 'pollutionPhoto', _id);
      tplData.isApproved = data.isApproved;
      tplData.addedBy = data.addedBy;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Vehicle is Updated" : "A new vehicle is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteVehicle(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _vehicle.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

}

exports.default = Service;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9WZWhpY2xlU2VydmljZS5qcyJdLCJuYW1lcyI6WyJTZXJ2aWNlIiwibGlzdENvbG9yIiwicXVlcnkiLCJwYXJhbXMiLCJpc0FsbCIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsIm1lc3NhZ2UiLCJyZXN1bHQiLCJkYXRhIiwicGFnZSIsImxpbWl0IiwidG90YWwiLCJzdGF0dXMiLCJzZWFyY2giLCJfaWQiLCJpc0RlbGV0ZWQiLCIkb3IiLCJuYW1lIiwiJHJlZ2V4Iiwia2V5IiwiY29kZSIsIiRhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkc29ydCIsImlzQWN0aXZlIiwiY291bnRlciIsIkNvbG9yTW9kZWwiLCJhZ2dyZWdhdGUiLCIkY291bnQiLCIkbGltaXQiLCIkc2tpcCIsImxlbmd0aCIsImUiLCJFcnJvciIsInNhdmVDb2xvciIsInRwbERhdGEiLCJmaW5kQnlJZCIsInNhdmUiLCJkZWxldGVDb2xvciIsImNvbmQiLCJ1cGRhdGVPbmUiLCJsaXN0TWFrZSIsIndpdGhNb2RlbHMiLCJtb2RlbHMiLCJhY3RpdmUiLCJtb2RlbFNlYXJjaCIsIm1vZGVsQWN0aXZlIiwicHVzaCIsIiRsb29rdXAiLCJmcm9tIiwibG9jYWxGaWVsZCIsImZvcmVpZ25GaWVsZCIsImFzIiwicGlwZWxpbmUiLCIkcHJvamVjdCIsIk1ha2VNb2RlbCIsInNhdmVNYWtlIiwiZGVsZXRlTWFrZSIsImxpc3RNYWtlTW9kZWwiLCIkdW53aW5kIiwibWFrZSIsIm1ha2VEZXRhaWxzIiwiTWFrZU1vZGVsTW9kZWwiLCJzYXZlTWFrZU1vZGVsIiwiZGVsZXRlTWFrZU1vZGVsIiwibGlzdFZlaGljbGVDYXRlZ29yeSIsInNsdWciLCJzZXJ2aWNlVHlwZSIsIm1vbmdvb3NlIiwiVHlwZXMiLCJPYmplY3RJZCIsInNlcnZpY2VUeXBlRGV0YWlscyIsImltYWdlIiwidXJsIiwiJGNvbmNhdCIsImNvbmZpZyIsImFwcGxpY2F0aW9uRmlsZVVybCIsIlZlaGljbGVDYXRlZ29yeU1vZGVsIiwic2F2ZVZlaGljbGVDYXRlZ29yeSIsInBob3RvIiwidXBsb2FkUGF0aHMiLCJ2ZWhpY2xlIiwiY2F0ZWdvcnkiLCJkZWxldGVWZWhpY2xlQ2F0ZWdvcnkiLCJsaXN0VmVoaWNsZSIsInBhcnNlSW50IiwiaXNOYU4iLCJ2ZWhpY2xlTnVtYmVyIiwidmVoaWNsZUlkIiwiZHJpdmVyU2VhcmNoIiwiaXNBcHByb3ZlZCIsImRyaXZlckFwcHJvdmVkIiwicGF0aCIsInByZXNlcnZlTnVsbEFuZEVtcHR5QXJyYXlzIiwicmlkZVR5cGVzIiwidmVoaWNsZUNhdGVnb3J5Iiwic3RhdGUiLCJkaXN0cmljdCIsInRhbHVrIiwibW9kZWwiLCJjb2xvciIsImF2YWlsYWJsZVNlYXRzIiwiYXZhaWxhYmxlQ2FwYWNpdHkiLCJtYW51ZmFjdHVyaW5nWWVhciIsIm90aGVyUGhvdG9zIiwiJG1hcCIsImlucHV0IiwiaW4iLCJyZWdpc3RyYXRpb25OdW1iZXIiLCJyZWdpc3RyYXRpb25FeHBpcnlEYXRlIiwicmVnaXN0cmF0aW9uUGhvdG8iLCJyZWdpc3RyYXRpb25JbWFnZSIsImluc3VyYW5jZU51bWJlciIsImluc3VyYW5jZUV4cGlyeURhdGUiLCJpbnN1cmFuY2VQaG90byIsImluc3VyYW5jZUltYWdlIiwicGVybWl0TnVtYmVyIiwicGVybWl0RXhwaXJ5RGF0ZSIsInBlcm1pdFBob3RvIiwicGVybWl0SW1hZ2UiLCJwb2xsdXRpb25OdW1iZXIiLCJwb2xsdXRpb25FeHBpcnlEYXRlIiwicG9sbHV0aW9uUGhvdG8iLCJwb2xsdXRpb25JbWFnZSIsImFkZGVkQnkiLCJjcmVhdGVkQXQiLCJzdGF0ZURldGFpbHMiLCJkaXN0cmljdERldGFpbHMiLCJ0YWx1a0RldGFpbHMiLCJkcml2ZXJEZXRhaWxzIiwiVmVoaWNsZU1vZGVsIiwic2F2ZVZlaGljbGUiLCJwcmltYXJ5UGhvdG8iLCJkZWxldGluZ0ZpbGVzIiwiZG9jdW1lbnQiLCJkZWxldGVWZWhpY2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FB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QUFBQSxVQUFVLEVBQUUsR0FBZDtBQUFtQkMsTUFBQUEsT0FBTyxFQUFFLFFBQTVCO0FBQXNDTSxNQUFBQSxNQUFNLEVBQUU7QUFBOUMsS0FBakI7O0FBRUEsUUFBSTtBQUNBLFlBQU1zSCxpQkFBYTFGLFNBQWI7QUFBeUIxQixRQUFBQTtBQUF6QixTQUFpQ3lCLElBQWpDLEdBQXlDO0FBQUV4QixRQUFBQSxTQUFTLEVBQUU7QUFBYixPQUF6QyxDQUFOO0FBRUFYLE1BQUFBLFFBQVEsQ0FBQ0UsT0FBVCxHQUFtQixzQkFBbkI7QUFDQUYsTUFBQUEsUUFBUSxDQUFDQyxVQUFULEdBQXNCLEdBQXRCO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ1EsTUFBVCxHQUFrQixJQUFsQjtBQUVBLGFBQU9SLFFBQVA7QUFFSCxLQVRELENBU0UsT0FBTzRCLENBQVAsRUFBVTtBQUNSLFlBQU0sSUFBSUMsS0FBSixDQUFVLHVDQUFWLENBQU47QUFDSDtBQUNKOztBQTE1QndCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlaGljbGVNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy92ZWhpY2xlXCI7XHJcbmltcG9ydCB7IGNsZWFyU2VhcmNoLCB1cGxvYWRNdWx0aXBsZUZpbGUsIHVwbG9hZEZpbGUsIGdldEFkbWluRmlsdGVyIH0gZnJvbSBcIi4uL3V0bHMvX2hlbHBlclwiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi91dGxzL2NvbmZpZ1wiO1xyXG4vLyBpbXBvcnQgeyBzZW5kUmVzZXRQYXNzd29yZE1haWwgfSBmcm9tIFwiLi4vdGhyaXJkUGFydHkvZW1haWxTZXJ2aWNlcy92ZWhpY2xlT3duZXIvc2VuZEVtYWlsXCI7XHJcbmltcG9ydCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy92ZWhpY2FsZUNhdGVnb3J5TW9kZWxcIjtcclxuaW1wb3J0IENvbG9yTW9kZWwgZnJvbSBcIi4uL2RhdGEtYmFzZS9tb2RlbHMvY29sb3JcIjtcclxuaW1wb3J0IE1ha2VNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy9tYWtlXCI7XHJcbmltcG9ydCBNYWtlTW9kZWxNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy9tYWtlTW9kZWxcIjtcclxuaW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSB7XHJcblxyXG4gICAgLypcclxuICAgIHN0YXRpYyBhc3luYyBvd25lckxvZ2luKGRhdGEpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gZGF0YS5lbWFpbDtcclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IGRhdGEucGFzc3dvcmQ7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYXdhaXQgVmVoaWNsZU93bmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsOiBlbWFpbCwgaXNEZWxldGVkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgbGV0IGlzUGFzc3dvcmRNYXRjaGVkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIG93bmVyLnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgaWYgKCFpc1Bhc3N3b3JkTWF0Y2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBDcmVkZW50aWFsc1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEpXVF9FWFBfRFVSID0gY29uZmlnLmp3dC5leHBEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gand0LnNpZ24oeyBzdWI6IG93bmVyLl9pZC50b1N0cmluZygpLCBleHA6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgKChKV1RfRVhQX0RVUikgKiA2MCksIH0sIGNvbmZpZy5qd3Quc2VjcmV0S2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW93bmVyLmVtYWlsVmVyZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSA0MDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRW1haWwgaXMgbm90IHZlcmlmaWVkLiBQbGVhc2UgdmVyaWZ5IGZyb20gdGhlIGxpbmsgc2VudCB0byB5b3VyIGVtYWlsISFcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW93bmVyLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDQwMTtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJZb3VyIGFjb3VudCBpcyBibG9ja2VkLiBQbGVhc2UgY29udGFjdCBhZG1pblwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiTG9nZ2VkaW4gc3VjY2Vzc2Z1bGx5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEgPSB7IGFjY2Vzc1Rva2VuIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIG93bmVyVmVyaWZ5RW1haWwoZW1haWwpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGF3YWl0IFZlaGljbGVPd25lck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyLmVtYWlsVmVyZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkVtYWlsIGlzIGFscmVhZHkgdmVyaWZpZWRcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIuZW1haWxWZXJmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBvd25lci5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRW1haWwgaXMgdmVyaWZpZWRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXRoXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBvd25lckdlbkZvcmdldFBhc3N3b3JkVXJsKGVtYWlsKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gYXdhaXQgVmVoaWNsZU93bmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsOiBlbWFpbCwgaXNEZWxldGVkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgaWYgKHRwbERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVTdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgY29uZmlnLmZvcmdldFBhc3NFeHBUaW1lICogNjAgKiAxMDAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW5jS2V5ID0gZW5jcnlwdERhdGEoZW5jcnlwdERhdGEodGltZVN0YW1wICsgJy0tLS0tJyArIGVtYWlsKSk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBzZW5kUmVzZXRQYXNzd29yZE1haWwoeyBrZXk6IGVuY0tleSwgZW1haWw6IGVtYWlsLCB2YWxpZEZvcjogY29uZmlnLmZvcmdldFBhc3NFeHBUaW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiQSByZXNldCBwYXNzd29yZCBsaW5rIGhhcyBiZWVuIHNlbnQgdG8geW91ciBlbWFpbC4gUGxlYXNlIGNoZWNrIGFuZCByZXNldCB5b3VyIHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGVtYWlsIGlzIG5vdCByZWdpc3RlcmVkIHdpdGggYW55IGFjY291bnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgb3duZXJSZXNldFBBc3N3b3JkKGtleSwgZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZGVjS2V5ID0gZGVjcnlwdERhdGEoZGVjcnlwdERhdGEoa2V5KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWVTdGFtcCA9IGRlY0tleS5zcGxpdCgnLS0tLS0nKVswXTtcclxuICAgICAgICAgICAgY29uc3QgZW1haWwgPSBkZWNLZXkuc3BsaXQoJy0tLS0tJylbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNUaW1lU3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRwbERhdGEgPSBhd2FpdCBWZWhpY2xlT3duZXJNb2RlbC5maW5kT25lKHsgZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGltZVN0YW1wID49IGNUaW1lU3RhbXApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0cGxEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHBsRGF0YS5wYXNzd29yZCA9IGRhdGEucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiUGFzc3dvcmQgaXMgdXBkYXRlZC4gVHJ5IGxvZ2luIGFnYW5pblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIlRpbWUgZXhwaXJlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICovXHJcblxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0Q29sb3IocXVlcnksIHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IGlzQWxsID0gcGFyYW1zLmlzQWxsID09PSAnQUxMJztcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnRGF0YSBub3QgZm91bmQhJyxcclxuICAgICAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IHF1ZXJ5LnBhZ2UgKiAxID4gMCA/IHF1ZXJ5LnBhZ2UgKiAxIDogMSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBxdWVyeS5saW1pdCAqIDEgPiAwID8gcXVlcnkubGltaXQgKiAxIDogMjAsXHJcbiAgICAgICAgICAgICAgICB0b3RhbDogMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhdHVzOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IHtcclxuICAgICAgICAgICAgICAgIF9pZDogcXVlcnkuX2lkLFxyXG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRvcjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gYXdhaXQgQ29sb3JNb2RlbC5hZ2dyZWdhdGUoWy4uLiRhZ2dyZWdhdGUsIHsgJGNvdW50OiBcInRvdGFsXCIgfV0pO1xyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQudG90YWwgPSBjb3VudGVyWzBdPy50b3RhbDtcclxuICAgICAgICAgICAgaWYgKGlzQWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQucGFnZSA9IDE7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQubGltaXQgPSByZXNwb25zZS5yZXN1bHQudG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5kYXRhID0gYXdhaXQgQ29sb3JNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlQ29sb3IoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IF9pZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRwbERhdGEgPSBfaWQgPyBhd2FpdCBDb2xvck1vZGVsLmZpbmRCeUlkKF9pZCkgOiBuZXcgQ29sb3JNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5uYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmNvZGUgPSBkYXRhLmNvZGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuaXNBY3RpdmUgPSBkYXRhLmlzQWN0aXZlO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5zYXZlKCk7XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gX2lkID8gXCJDb2xvciBpcyBVcGRhdGVkXCIgOiBcIkEgbmV3IGNvbG9yIGlzIGNyZWF0ZWRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlQ29sb3IoX2lkLCBjb25kKSB7XHJcbiAgICAgICAgY29uZCA9ICFjb25kID8ge30gOiBjb25kO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IENvbG9yTW9kZWwudXBkYXRlT25lKHsgX2lkLCAuLi5jb25kIH0sIHsgaXNEZWxldGVkOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gbm90IGRlbGV0ZS4gU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0TWFrZShxdWVyeSwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaXNBbGwgPSBwYXJhbXMuaXNBbGwgPT09ICdBTEwnO1xyXG4gICAgICAgIGNvbnN0IHdpdGhNb2RlbHMgPSBxdWVyeT8ubW9kZWxzID09IDE7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RhdGEgbm90IGZvdW5kIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBxdWVyeS5wYWdlICogMSA+IDAgPyBxdWVyeS5wYWdlICogMSA6IDEsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogcXVlcnkubGltaXQgKiAxID4gMCA/IHF1ZXJ5LmxpbWl0ICogMSA6IDIwLFxyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBxdWVyeT8uYWN0aXZlID8gKHF1ZXJ5LmFjdGl2ZSA9PT0gJzEnKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRvcjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7ICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKicgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRhZ2dyZWdhdGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7ICRtYXRjaDogc2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICB7ICRzb3J0OiB7IF9pZDogLTEgfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiJHByb2plY3RcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbHM6IDFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpdGhNb2RlbHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsU2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBxdWVyeT8ubW9kZWxBY3RpdmUgPyAocXVlcnkubW9kZWxBY3RpdmUgPT09ICcxJykgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhclNlYXJjaChtb2RlbFNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAkYWdncmVnYXRlLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiAnbWFrZW1vZGVscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEZpZWxkOiAnX2lkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ21ha2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXM6ICdtb2RlbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ICRtYXRjaDogbW9kZWxTZWFyY2ggfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcm9qZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ZXIgPSBhd2FpdCBNYWtlTW9kZWwuYWdncmVnYXRlKFsuLi4kYWdncmVnYXRlLCB7ICRjb3VudDogXCJ0b3RhbFwiIH1dKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQuZGF0YSA9IGF3YWl0IE1ha2VNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlTWFrZShkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgX2lkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IF9pZCA/IGF3YWl0IE1ha2VNb2RlbC5maW5kQnlJZChfaWQpIDogbmV3IE1ha2VNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5uYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmtleSA9IGRhdGEua2V5O1xyXG4gICAgICAgICAgICB0cGxEYXRhLmlzQWN0aXZlID0gZGF0YS5pc0FjdGl2ZTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IF9pZCA/IFwiTWFrZSBpcyBVcGRhdGVkXCIgOiBcIkEgbmV3IG1ha2UgaXMgY3JlYXRlZFwiO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVNYWtlKF9pZCwgY29uZCkge1xyXG4gICAgICAgIGNvbmQgPSAhY29uZCA/IHt9IDogY29uZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBNYWtlTW9kZWwudXBkYXRlT25lKHsgX2lkLCAuLi5jb25kIH0sIHsgaXNEZWxldGVkOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gbm90IGRlbGV0ZS4gU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0TWFrZU1vZGVsKHF1ZXJ5LCBwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCBpc0FsbCA9IHBhcmFtcy5pc0FsbCA9PT0gJ0FMTCc7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RhdGEgbm90IGZvdW5kIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBxdWVyeS5wYWdlICogMSA+IDAgPyBxdWVyeS5wYWdlICogMSA6IDEsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogcXVlcnkubGltaXQgKiAxID4gMCA/IHF1ZXJ5LmxpbWl0ICogMSA6IDIwLFxyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHsgJHJlZ2V4OiAnLionICsgKHF1ZXJ5Py5rZXkgfHwgJycpICsgJy4qJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICdtYWtlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsRmllbGQ6ICdtYWtlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWlnbkZpZWxkOiAnX2lkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXM6ICdtYWtlRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIkcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICR1bndpbmQ6IFwiJG1ha2VEZXRhaWxzXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIkcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2U6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFrZURldGFpbHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IGF3YWl0IE1ha2VNb2RlbE1vZGVsLmFnZ3JlZ2F0ZShbLi4uJGFnZ3JlZ2F0ZSwgeyAkY291bnQ6IFwidG90YWxcIiB9XSk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC50b3RhbCA9IGNvdW50ZXJbMF0/LnRvdGFsO1xyXG4gICAgICAgICAgICBpZiAoaXNBbGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5wYWdlID0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5saW1pdCA9IHJlc3BvbnNlLnJlc3VsdC50b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmRhdGEgPSBhd2FpdCBNYWtlTW9kZWxNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlTWFrZU1vZGVsKGRhdGEpIHtcclxuICAgICAgICBjb25zdCBfaWQgPSBkYXRhLl9pZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gX2lkID8gYXdhaXQgTWFrZU1vZGVsTW9kZWwuZmluZEJ5SWQoX2lkKSA6IG5ldyBNYWtlTW9kZWxNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5tYWtlID0gZGF0YS5tYWtlO1xyXG4gICAgICAgICAgICB0cGxEYXRhLm5hbWUgPSBkYXRhLm5hbWU7XHJcbiAgICAgICAgICAgIHRwbERhdGEua2V5ID0gZGF0YS5rZXk7XHJcbiAgICAgICAgICAgIHRwbERhdGEuaXNBY3RpdmUgPSBkYXRhLmlzQWN0aXZlO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5zYXZlKCk7XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gX2lkID8gXCJNYWtlIG1vZGVsIGlzIFVwZGF0ZWRcIiA6IFwiQSBuZXcgbWFrZSBtb2RlbCBpcyBjcmVhdGVkXCI7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZU1ha2VNb2RlbChfaWQsIGNvbmQpIHtcclxuICAgICAgICBjb25kID0gIWNvbmQgPyB7fSA6IGNvbmQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgTWFrZU1vZGVsTW9kZWwudXBkYXRlT25lKHsgX2lkLCAuLi5jb25kIH0sIHsgaXNEZWxldGVkOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gbm90IGRlbGV0ZS4gU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0VmVoaWNsZUNhdGVnb3J5KHF1ZXJ5LCBwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCBpc0FsbCA9IHBhcmFtcy5pc0FsbCA9PT0gJ0FMTCc7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RhdGEgbm90IGZvdW5kIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBxdWVyeS5wYWdlICogMSA+IDAgPyBxdWVyeS5wYWdlICogMSA6IDEsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogcXVlcnkubGltaXQgKiAxID4gMCA/IHF1ZXJ5LmxpbWl0ICogMSA6IDIwLFxyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHsgJHJlZ2V4OiAnLionICsgKHF1ZXJ5Py5rZXkgfHwgJycpICsgJy4qJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsdWc6IHsgJHJlZ2V4OiAnLionICsgKHF1ZXJ5Py5rZXkgfHwgJycpICsgJy4qJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlVHlwZTogcXVlcnkuc2VydmljZVR5cGUgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChxdWVyeS5zZXJ2aWNlVHlwZSkgOiAnJyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICdzZXJ2aWNldHlwZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEZpZWxkOiAnc2VydmljZVR5cGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ3NlcnZpY2VUeXBlRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgJHVud2luZDogXCIkc2VydmljZVR5cGVEZXRhaWxzXCIgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VUeXBlRGV0YWlsczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2x1ZzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHsgJGNvbmNhdDogW2NvbmZpZy5hcHBsaWNhdGlvbkZpbGVVcmwgKyAndmVoaWNsZS9jYXRlZ29yeS8nLCBcIiRwaG90b1wiXSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkcGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gYXdhaXQgVmVoaWNsZUNhdGVnb3J5TW9kZWwuYWdncmVnYXRlKFsuLi4kYWdncmVnYXRlLCB7ICRjb3VudDogXCJ0b3RhbFwiIH1dKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQuZGF0YSA9IGF3YWl0IFZlaGljbGVDYXRlZ29yeU1vZGVsLmFnZ3JlZ2F0ZShcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi4kYWdncmVnYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgJGxpbWl0OiByZXNwb25zZS5yZXN1bHQubGltaXQgKyByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgJHNraXA6IHJlc3BvbnNlLnJlc3VsdC5saW1pdCAqIChyZXNwb25zZS5yZXN1bHQucGFnZSAtIDEpIH1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3VsdC5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGF0YSBmZXRjaGVkXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZVZlaGljbGVDYXRlZ29yeShkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgX2lkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IF9pZCA/IGF3YWl0IFZlaGljbGVDYXRlZ29yeU1vZGVsLmZpbmRCeUlkKF9pZCkgOiBuZXcgVmVoaWNsZUNhdGVnb3J5TW9kZWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEuc2VydmljZVR5cGUgPSBkYXRhLnNlcnZpY2VUeXBlO1xyXG4gICAgICAgICAgICB0cGxEYXRhLm5hbWUgPSBkYXRhLm5hbWU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuc2x1ZyA9IGRhdGEuc2x1ZztcclxuICAgICAgICAgICAgdHBsRGF0YS5waG90byA9IGF3YWl0IHVwbG9hZEZpbGUoZGF0YS5waG90bywgY29uZmlnLnVwbG9hZFBhdGhzLnZlaGljbGUuY2F0ZWdvcnksIFZlaGljbGVDYXRlZ29yeU1vZGVsLCAncGhvdG8nLCBfaWQpO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmlzQWN0aXZlID0gZGF0YS5pc0FjdGl2ZTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IF9pZCA/IFwiVmVoaWNsZSBjYXRlZ29yeSBpcyBVcGRhdGVkXCIgOiBcIkEgbmV3IHZlaGljbGUgY2F0ZWdvcnkgaXMgY3JlYXRlZFwiO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVWZWhpY2xlQ2F0ZWdvcnkoX2lkLCBjb25kKSB7XHJcbiAgICAgICAgY2xlYXJTZWFyY2goeyBjb25kIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IFZlaGljbGVDYXRlZ29yeU1vZGVsLnVwZGF0ZU9uZSh7IF9pZCwgLi4uY29uZCB9LCB7IGlzRGVsZXRlZDogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCI7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gbm90IGRlbGV0ZS4gU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdFZlaGljbGUocXVlcnksIHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IGlzQWxsID0gcGFyYW1zLmlzQWxsID09PSAnQUxMJztcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnRGF0YSBub3QgZm91bmQhJyxcclxuICAgICAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IHF1ZXJ5LnBhZ2UgKiAxID4gMCA/IHF1ZXJ5LnBhZ2UgKiAxIDogMSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBxdWVyeS5saW1pdCAqIDEgPiAwID8gcXVlcnkubGltaXQgKiAxIDogMjAsXHJcbiAgICAgICAgICAgICAgICB0b3RhbDogMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhdHVzOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5LmtleSA9IHR5cGVvZiBwYXJzZUludChxdWVyeS5rZXkpID09PSAnbnVtYmVyJyAmJiAhaXNOYU4ocGFyc2VJbnQocXVlcnkua2V5KSkgPyBwYXJzZUludChxdWVyeS5rZXkpIDogcXVlcnkua2V5O1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHR5cGVvZiBxdWVyeS5rZXkgPT09ICdzdHJpbmcnID8geyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH0gOiAnJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZWhpY2xlTnVtYmVyOiB7ICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKicgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgdmVoaWNsZUlkOiB0eXBlb2YgcXVlcnkua2V5ID09PSAnbnVtYmVyJyA/IHF1ZXJ5LmtleSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IHF1ZXJ5LnNlcnZpY2VUeXBlID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocXVlcnkuc2VydmljZVR5cGUpIDogJycsXHJcbiAgICAgICAgICAgICAgICAuLi5nZXRBZG1pbkZpbHRlcigpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjbGVhclNlYXJjaChzZWFyY2gpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZHJpdmVyU2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgaXNBcHByb3ZlZDpcclxuICAgICAgICAgICAgICAgICAgICBxdWVyeS5kcml2ZXJBcHByb3ZlZCA9PSAndHJ1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogcXVlcnkuZHJpdmVyQXBwcm92ZWQgPT0gJ2ZhbHNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKGRyaXZlclNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICdzdGF0ZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEZpZWxkOiAnc3RhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ3N0YXRlRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7ICR1bndpbmQ6IFwiJHN0YXRlRGV0YWlsc1wiIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvb2t1cDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiAnZGlzdHJpY3RzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ2Rpc3RyaWN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWlnbkZpZWxkOiAnX2lkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXM6ICdkaXN0cmljdERldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBlbGluZTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcm9qZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyAkdW53aW5kOiBcIiRkaXN0cmljdERldGFpbHNcIiB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb29rdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3RhbHVrcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsRmllbGQ6ICd0YWx1aycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzOiAndGFsdWtEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcHJvamVjdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgJHVud2luZDogXCIkdGFsdWtEZXRhaWxzXCIgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICdkcml2ZXJzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ3ZlaGljbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ2RyaXZlckRldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBlbGluZTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAkbWF0Y2g6IGRyaXZlclNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcm9qZWN0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQXBwcm92ZWQ6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICR1bndpbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogXCIkZHJpdmVyRGV0YWlsc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZU51bGxBbmRFbXB0eUFycmF5czogdHlwZW9mIHF1ZXJ5LmRyaXZlckFwcHJvdmVkID09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVoaWNsZUlkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlVHlwZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlkZVR5cGVzOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZWhpY2xlQ2F0ZWdvcnk6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFsdWs6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2U6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVoaWNsZU51bWJlcjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlU2VhdHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYW51ZmFjdHVyaW5nWWVhcjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyUGhvdG9zOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB7ICRjb25jYXQ6IFtjb25maWcuYXBwbGljYXRpb25GaWxlVXJsICsgJ3ZlaGljbGUvcGhvdG8vJywgXCIkcHJpbWFyeVBob3RvXCJdIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIiRwcmltYXJ5UGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclBob3Rvczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1hcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBcIiRvdGhlclBob3Rvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzOiBcImltYWdlc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICd2ZWhpY2xlL3Bob3RvLycsIFwiJCRpbWFnZXNcIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkJGltYWdlc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uTnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpc3RyYXRpb25FeHBpcnlEYXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpc3RyYXRpb25QaG90bzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uSW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICd2ZWhpY2xlL2RvY3VtZW50LycsIFwiJHJlZ2lzdHJhdGlvblBob3RvXCJdIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIiRwcmltYXJ5UGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdXJhbmNlTnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN1cmFuY2VFeHBpcnlEYXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN1cmFuY2VQaG90bzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdXJhbmNlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICd2ZWhpY2xlL2RvY3VtZW50LycsIFwiJGluc3VyYW5jZVBob3RvXCJdIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIiRwcmltYXJ5UGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVybWl0TnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJtaXRFeHBpcnlEYXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJtaXRQaG90bzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVybWl0SW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICd2ZWhpY2xlL2RvY3VtZW50LycsIFwiJHBlcm1pdFBob3RvXCJdIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIiRwcmltYXJ5UGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9sbHV0aW9uTnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xsdXRpb25FeHBpcnlEYXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2xsdXRpb25QaG90bzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9sbHV0aW9uSW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICd2ZWhpY2xlL2RvY3VtZW50LycsIFwiJHBvbGx1dGlvblBob3RvXCJdIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIiRwcmltYXJ5UGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZEJ5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkQXQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlRGV0YWlsczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3REZXRhaWxzOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWx1a0RldGFpbHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlckRldGFpbHM6IDFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ZXIgPSBhd2FpdCBWZWhpY2xlTW9kZWwuYWdncmVnYXRlKFsuLi4kYWdncmVnYXRlLCB7ICRjb3VudDogXCJ0b3RhbFwiIH1dKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQuZGF0YSA9IGF3YWl0IFZlaGljbGVNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlVmVoaWNsZShkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgX2lkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IF9pZCA/IGF3YWl0IFZlaGljbGVNb2RlbC5maW5kQnlJZChfaWQpIDogbmV3IFZlaGljbGVNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS52ZWhpY2xlSWQgPSBkYXRhLnZlaGljbGVJZDtcclxuICAgICAgICAgICAgdHBsRGF0YS5zZXJ2aWNlVHlwZSA9IGRhdGEuc2VydmljZVR5cGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEucmlkZVR5cGVzID0gZGF0YS5yaWRlVHlwZXM7XHJcbiAgICAgICAgICAgIHRwbERhdGEudmVoaWNsZUNhdGVnb3J5ID0gZGF0YS52ZWhpY2xlQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIHRwbERhdGEuc3RhdGUgPSBkYXRhLnN0YXRlO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmRpc3RyaWN0ID0gZGF0YS5kaXN0cmljdDtcclxuICAgICAgICAgICAgdHBsRGF0YS50YWx1ayA9IGRhdGEudGFsdWs7XHJcbiAgICAgICAgICAgIHRwbERhdGEubWFrZSA9IGRhdGEubWFrZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5tb2RlbCA9IGRhdGEubW9kZWw7XHJcbiAgICAgICAgICAgIHRwbERhdGEuY29sb3IgPSBkYXRhLmNvbG9yO1xyXG4gICAgICAgICAgICB0cGxEYXRhLm5hbWUgPSBkYXRhLm5hbWU7XHJcbiAgICAgICAgICAgIHRwbERhdGEudmVoaWNsZU51bWJlciA9IGRhdGEudmVoaWNsZU51bWJlcjtcclxuICAgICAgICAgICAgdHBsRGF0YS5hdmFpbGFibGVTZWF0cyA9IGRhdGEuYXZhaWxhYmxlU2VhdHM7XHJcbiAgICAgICAgICAgIHRwbERhdGEuYXZhaWxhYmxlQ2FwYWNpdHkgPSBkYXRhLmF2YWlsYWJsZUNhcGFjaXR5O1xyXG4gICAgICAgICAgICB0cGxEYXRhLm1hbnVmYWN0dXJpbmdZZWFyID0gZGF0YS5tYW51ZmFjdHVyaW5nWWVhcjtcclxuICAgICAgICAgICAgdHBsRGF0YS5wcmltYXJ5UGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEucHJpbWFyeVBob3RvLCBjb25maWcudXBsb2FkUGF0aHMudmVoaWNsZS5waG90bywgVmVoaWNsZU1vZGVsLCAncHJpbWFyeVBob3RvJywgX2lkKTtcclxuICAgICAgICAgICAgdHBsRGF0YS5vdGhlclBob3RvcyA9IGF3YWl0IHVwbG9hZE11bHRpcGxlRmlsZShkYXRhLm90aGVyUGhvdG9zLCBjb25maWcudXBsb2FkUGF0aHMudmVoaWNsZS5waG90bywgVmVoaWNsZU1vZGVsLCAnb3RoZXJQaG90b3MnLCBfaWQsIGRhdGEuZGVsZXRpbmdGaWxlcyk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLnJlZ2lzdHJhdGlvbk51bWJlciA9IGRhdGEucmVnaXN0cmF0aW9uTnVtYmVyO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnJlZ2lzdHJhdGlvbkV4cGlyeURhdGUgPSBkYXRhLnJlZ2lzdHJhdGlvbkV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEucmVnaXN0cmF0aW9uUGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEucmVnaXN0cmF0aW9uUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy52ZWhpY2xlLmRvY3VtZW50LCBWZWhpY2xlTW9kZWwsICdyZWdpc3RyYXRpb25QaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLmluc3VyYW5jZU51bWJlciA9IGRhdGEuaW5zdXJhbmNlTnVtYmVyO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmluc3VyYW5jZUV4cGlyeURhdGUgPSBkYXRhLmluc3VyYW5jZUV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuaW5zdXJhbmNlUGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEuaW5zdXJhbmNlUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy52ZWhpY2xlLmRvY3VtZW50LCBWZWhpY2xlTW9kZWwsICdpbnN1cmFuY2VQaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLnBlcm1pdE51bWJlciA9IGRhdGEucGVybWl0TnVtYmVyO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnBlcm1pdEV4cGlyeURhdGUgPSBkYXRhLnBlcm1pdEV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEucGVybWl0UGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEucGVybWl0UGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy52ZWhpY2xlLmRvY3VtZW50LCBWZWhpY2xlTW9kZWwsICdwZXJtaXRQaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLnBvbGx1dGlvbk51bWJlciA9IGRhdGEucG9sbHV0aW9uTnVtYmVyO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnBvbGx1dGlvbkV4cGlyeURhdGUgPSBkYXRhLnBvbGx1dGlvbkV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEucG9sbHV0aW9uUGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEucG9sbHV0aW9uUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy52ZWhpY2xlLmRvY3VtZW50LCBWZWhpY2xlTW9kZWwsICdwb2xsdXRpb25QaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLmlzQXBwcm92ZWQgPSBkYXRhLmlzQXBwcm92ZWQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEuYWRkZWRCeSA9IGRhdGEuYWRkZWRCeTtcclxuICAgICAgICAgICAgdHBsRGF0YS5pc0FjdGl2ZSA9IGRhdGEuaXNBY3RpdmU7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBfaWQgPyBcIlZlaGljbGUgaXMgVXBkYXRlZFwiIDogXCJBIG5ldyB2ZWhpY2xlIGlzIGNyZWF0ZWRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlVmVoaWNsZShfaWQsIGNvbmQpIHtcclxuICAgICAgICBjb25kID0gIWNvbmQgPyB7fSA6IGNvbmQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgVmVoaWNsZU1vZGVsLnVwZGF0ZU9uZSh7IF9pZCwgLi4uY29uZCB9LCB7IGlzRGVsZXRlZDogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCI7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG5vdCBkZWxldGUuIFNvbWV0aGluZyB3ZW50IHdyb25nLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==