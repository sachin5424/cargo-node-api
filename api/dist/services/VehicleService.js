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