"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _permissionService = require("../../../services/permission-service");

var _index = require("../../../data-base/index");

var _test = require("../../../services/test");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PermissionController extends _permissionService.MongooseService {
  constructor() {
    super();
    this.userModelPermission = _index.UserAuthModelPermission;
  }

  static async get(req, res) {
    try {
      const getReq = req;
      const {
        model
      } = req.query;
      const temp = [];
      const check_admin = await _index.UserModel.findOne({
        _id: getReq.userId,
        isAdmin: true
      });

      if (check_admin) {
        const admin_permission = ["GET", "DELETE", "PUT", "POST"];
        return res.status(200).json({
          temp: [...temp, ...admin_permission]
        });
      }

      let test = [{
        $match: {
          userId: new _mongoose.default.Types.ObjectId(getReq.userId)
        }
      }, {
        $lookup: {
          from: "user_auth_permissions",
          localField: "permissionId",
          foreignField: "_id",
          as: "permission"
        }
      }, {
        $match: {
          "permission.model_name": model
        }
      }, {
        $project: {
          "permission.method": 1
        }
      }];
      const data = await (0, _test.aggregateFilter)(_index.UserAuthModelPermission, test);

      for (var i = 0; i < data.length; i++) {
        temp.push(data[i].permission[0].method);
      }

      res.status(200).json({
        data,
        temp
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  static async getPermission(req, res) {
    try {
      const data = await _index.UserAuthModelPermission.find();
      return res.status(200).json({
        data
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  static async addPermission(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        let payload = req.body;
        const newData = new _index.UserAuthModelPermission(payload);
        await newData.save(); // await this.add(this.userModelPermission,payload);

        return res.status(200).json({
          message: "add permission"
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error
      });
    }
  }

  static async addMultiPermission(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        let payload = req.body;
        let permissionList = req.body.permissionList;

        for (var i = 0; i < permissionList.length; i++) {
          const check_data = await this.userModelPermission.findOne({
            userId: permissionList[i].userId,
            permissionId: permissionList[i].permissionId
          });

          if (check_data) {
            return res.status(400).json({
              error: "err"
            });
          }
        }

        await this.userModelPermission.insertMany(payload.permissionList);
        return res.status(200).json({
          message: "add permission",
          payload
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error
      });
    }
  }

}

exports.default = PermissionController;