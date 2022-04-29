"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("../../../data-base/index");

var _test = require("../../../services/test");

var _import = require("../../../settings/import");

var _user = _interopRequireDefault(require("../../../services/user.server"));

var _UserService = _interopRequireDefault(require("../../../services/UserService"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _randToken = _interopRequireDefault(require("rand-token"));

var _config = _interopRequireDefault(require("../../../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import * as dotenv from "dotenv";
// dotenv.config();
class UserController extends _user.default {
  // private userData:UserListInterface[];
  constructor() {
    super();
  } // static async userList(req, res) {
  //     try {
  //         const userData = await UserModel.find().select('-password');
  //         return res.status(200).json({ data: userData });
  //     }
  //     catch (error) {
  //         return res.status(500).json({ error });
  //     }
  // }


  static async userProfile(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        const _id = req.params.id;
        const data = await _index.UserModel.findOne({
          _id
        });
        return res.status(200).json({
          data
        });
      }
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  static async userRegister(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        const payload = req.body;
        await (0, _test.createData)(_index.UserModel, payload);
        return res.status(200).json({
          data: "register"
        });
      }
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  static async userLogin(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _UserService.default.userLogin(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  } // static async userLogin(req, res) {
  //     try {
  //         const errors = validationResult(req);
  //         if (!errors.isEmpty()) {
  //             return res.status(422).json({
  //                 message: errors.msg,
  //                 errors: errors.errors
  //             });
  //         }
  //         else {
  //             const { email, password } = req.body;
  //             if (email) {
  //                 const user = await UserModel.findOne({ email: email });
  //                 const userDetails = {
  //                     userId: user._id,
  //                     email: user.email,
  //                     isAdmin: user.isAdmin,
  //                     isStaf: user.isStaf
  //                 };
  //                 const token = jwtToken.sign({ sub: userDetails.userId.toString(), exp: Math.floor(Date.now() / 1000) + ((Config.jwt.expDuration) * 60), }, Config.jwt.secretKey);
  //                 // var token = jwtToken.sign(userDetails, Config.jwt.secretKey, { expiresIn: Config.jwt.expDuration });
  //                 var refreshToken = randtoken.uid(256);
  //                 const check_token = await UserTokenModel.findOne({ email: email });
  //                 if (check_token) {
  //                     await UserTokenModel.findOneAndUpdate({ email: email }, { refreshToken });
  //                 }
  //                 else {
  //                     await createToken(UserTokenModel, { email: email, refreshToken });
  //                 }
  //                 return res.status(200).json({
  //                     accessToken: token,
  //                     refreshToken: refreshToken
  //                 });
  //             }
  //             // const data = await createData(UserModel, payload)
  //             return res.status(400).json({ message: "try agin" });
  //         }
  //     }
  //     catch (error) {
  //         return res.status(500).json({ error });
  //     }
  // }


  static async userRefreshToken(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(401).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        const {
          email,
          refreshToken
        } = req.body;
        const data = await _index.UserTokenModel.findOne({
          email: email,
          refreshToken: refreshToken
        });

        if (data) {
          var user = {
            'email': email
          };

          var token = _jsonwebtoken.default.sign(user, _config.default.jwt.secretKey, {
            expiresIn: _config.default.jwt.expDuration
          });

          return res.status(200).json({
            token: token
          });
        }

        return res.send(400).json({
          error: "Invalid refreshToken"
        });
      }
    } catch (error) {
      return res.send(500).json({
        error
      });
    }
  }

  static async userTokenDelete(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      } else {
        const {
          email,
          refreshToken
        } = req.body;
        await _index.UserTokenModel.findOneAndDelete({
          email: email,
          refreshToken: refreshToken
        }).catch(err => {
          return res.send(400).json({
            error: "Invalid refreshToken"
          });
        });
        return res.send(200).json({
          error: "delete refreshToken"
        });
      }
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  static async list(req, res) {
    try {
      const srvRes = await _UserService.default.listUser(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const errors = (0, _import.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _UserService.default.saveUser(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _UserService.default.deleteUser(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = UserController;