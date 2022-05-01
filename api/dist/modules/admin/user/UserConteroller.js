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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3VzZXIvVXNlckNvbnRlcm9sbGVyLmpzIl0sIm5hbWVzIjpbIlVzZXJDb250cm9sbGVyIiwiVXNlclNlcnZpY2UiLCJjb25zdHJ1Y3RvciIsInVzZXJQcm9maWxlIiwicmVxIiwicmVzIiwiZXJyb3JzIiwiaXNFbXB0eSIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIiwibXNnIiwiX2lkIiwicGFyYW1zIiwiaWQiLCJkYXRhIiwiVXNlck1vZGVsIiwiZmluZE9uZSIsImVycm9yIiwidXNlclJlZ2lzdGVyIiwicGF5bG9hZCIsImJvZHkiLCJ1c2VyTG9naW4iLCJzcnZSZXMiLCJTZXJ2aWNlIiwic3RhdHVzQ29kZSIsImUiLCJzZW5kIiwidXNlclJlZnJlc2hUb2tlbiIsImVtYWlsIiwicmVmcmVzaFRva2VuIiwiVXNlclRva2VuTW9kZWwiLCJ1c2VyIiwidG9rZW4iLCJqd3RUb2tlbiIsInNpZ24iLCJDb25maWciLCJqd3QiLCJzZWNyZXRLZXkiLCJleHBpcmVzSW4iLCJleHBEdXJhdGlvbiIsInVzZXJUb2tlbkRlbGV0ZSIsImZpbmRPbmVBbmREZWxldGUiLCJjYXRjaCIsImVyciIsImxpc3QiLCJsaXN0VXNlciIsInF1ZXJ5Iiwic2F2ZSIsInNhdmVVc2VyIiwiZGVsZXRlIiwiZGVsZXRlVXNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBQ0E7QUFHQTtBQUNlLE1BQU1BLGNBQU4sU0FBNkJDLGFBQTdCLENBQXlDO0FBQ3BEO0FBQ0FDLEVBQUFBLFdBQVcsR0FBRztBQUNWO0FBQ0gsR0FKbUQsQ0FNcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDd0IsZUFBWEMsV0FBVyxDQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUMvQixRQUFJO0FBQ0EsWUFBTUMsTUFB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Q0ssR0FEUTtBQUV4QkwsVUFBQUEsTUFBTSxFQUFFQSxNQUFNLENBQUNBO0FBRlMsU0FBckIsQ0FBUDtBQUlIOztBQUNWLFlBQU1pQixNQUFNLEdBQUcsTUFBTUMscUJBQVF5QixRQUFSLENBQWlCN0MsR0FBRyxDQUFDaUIsSUFBckIsQ0FBckI7QUFDUyxhQUFPaEIsR0FBRyxDQUFDRyxNQUFKLENBQVdlLE1BQU0sQ0FBQ0UsVUFBbEIsRUFBOEJoQixJQUE5QixtQkFBd0NjLE1BQXhDLEVBQVA7QUFDSCxLQVZELENBVUUsT0FBT0csQ0FBUCxFQUFVO0FBQ2pCLGFBQU9yQixHQUFHLENBQUNHLE1BQUosQ0FBVyxHQUFYLEVBQWdCbUIsSUFBaEIsQ0FBcUI7QUFBQ2pCLFFBQUFBLE9BQU8sRUFBRWdCLENBQUMsQ0FBQ2hCO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWtCLGVBQU53QyxNQUFNLENBQUM5QyxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUMxQixRQUFJO0FBQ1QsWUFBTWtCLE1BQU0sR0FBRyxNQUFNQyxxQkFBUTJCLFVBQVIsQ0FBbUIvQyxHQUFHLENBQUNTLE1BQUosQ0FBV0MsRUFBOUIsQ0FBckI7QUFDUyxhQUFPVCxHQUFHLENBQUNHLE1BQUosQ0FBV2UsTUFBTSxDQUFDRSxVQUFsQixFQUE4QmhCLElBQTlCLG1CQUF3Q2MsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPRyxDQUFQLEVBQVU7QUFDakIsYUFBT3JCLEdBQUcsQ0FBQ0csTUFBSixDQUFXLEdBQVgsRUFBZ0JtQixJQUFoQixDQUFxQjtBQUFDakIsUUFBQUEsT0FBTyxFQUFFZ0IsQ0FBQyxDQUFDaEI7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFsTW1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlck1vZGVsLCBVc2VyVG9rZW5Nb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9kYXRhLWJhc2UvaW5kZXhcIjtcclxuaW1wb3J0IHsgY3JlYXRlRGF0YSwgY3JlYXRlVG9rZW4gfSBmcm9tIFwiLi4vLi4vLi4vc2VydmljZXMvdGVzdFwiO1xyXG5pbXBvcnQge3ZhbGlkYXRpb25SZXN1bHR9IGZyb20gXCIuLi8uLi8uLi9zZXR0aW5ncy9pbXBvcnRcIjtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlIGZyb20gXCIuLi8uLi8uLi9zZXJ2aWNlcy91c2VyLnNlcnZlclwiO1xyXG5pbXBvcnQgU2VydmljZSBmcm9tIFwiLi4vLi4vLi4vc2VydmljZXMvVXNlclNlcnZpY2VcIjtcclxuaW1wb3J0IGp3dFRva2VuIGZyb20gXCJqc29ud2VidG9rZW5cIjtcclxuaW1wb3J0IHJhbmR0b2tlbiBmcm9tIFwicmFuZC10b2tlblwiO1xyXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi8uLi91dGxzL2NvbmZpZ1wiO1xyXG4vLyBpbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSBcImRvdGVudlwiO1xyXG5cclxuXHJcbi8vIGRvdGVudi5jb25maWcoKTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckNvbnRyb2xsZXIgZXh0ZW5kcyBVc2VyU2VydmljZSB7XHJcbiAgICAvLyBwcml2YXRlIHVzZXJEYXRhOlVzZXJMaXN0SW50ZXJmYWNlW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIC8vIHN0YXRpYyBhc3luYyB1c2VyTGlzdChyZXEsIHJlcykge1xyXG4gICAgLy8gICAgIHRyeSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gYXdhaXQgVXNlck1vZGVsLmZpbmQoKS5zZWxlY3QoJy1wYXNzd29yZCcpO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBkYXRhOiB1c2VyRGF0YSB9KTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIHN0YXRpYyBhc3luYyB1c2VyUHJvZmlsZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcclxuICAgICAgICAgICAgaWYgKCFlcnJvcnMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MjIpLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9ycy5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBlcnJvcnMuZXJyb3JzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IF9pZCA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgVXNlck1vZGVsLmZpbmRPbmUoeyBfaWQgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvciB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgdXNlclJlZ2lzdGVyKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xyXG4gICAgICAgICAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQyMikuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JzLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IGVycm9ycy5lcnJvcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgY3JlYXRlRGF0YShVc2VyTW9kZWwsIHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZGF0YTogXCJyZWdpc3RlclwiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvciB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgdXNlckxvZ2luKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xyXG4gICAgICAgICAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQyMikuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JzLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IGVycm9ycy5lcnJvcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLnVzZXJMb2dpbihyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIC8vIHN0YXRpYyBhc3luYyB1c2VyTG9naW4ocmVxLCByZXMpIHtcclxuICAgIC8vICAgICB0cnkge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XHJcbiAgICAvLyAgICAgICAgIGlmICghZXJyb3JzLmlzRW1wdHkoKSkge1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5qc29uKHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMubXNnLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGVycm9yczogZXJyb3JzLmVycm9yc1xyXG4gICAgLy8gICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gcmVxLmJvZHk7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAoZW1haWwpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwgfSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc3QgdXNlckRldGFpbHMgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5faWQsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpc0FkbWluOiB1c2VyLmlzQWRtaW4sXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGlzU3RhZjogdXNlci5pc1N0YWZcclxuICAgIC8vICAgICAgICAgICAgICAgICB9O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0VG9rZW4uc2lnbih7IHN1YjogdXNlckRldGFpbHMudXNlcklkLnRvU3RyaW5nKCksIGV4cDogTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkgKyAoKENvbmZpZy5qd3QuZXhwRHVyYXRpb24pICogNjApLCB9LCBDb25maWcuand0LnNlY3JldEtleSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gdmFyIHRva2VuID0gand0VG9rZW4uc2lnbih1c2VyRGV0YWlscywgQ29uZmlnLmp3dC5zZWNyZXRLZXksIHsgZXhwaXJlc0luOiBDb25maWcuand0LmV4cER1cmF0aW9uIH0pO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciByZWZyZXNoVG9rZW4gPSByYW5kdG9rZW4udWlkKDI1Nik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tfdG9rZW4gPSBhd2FpdCBVc2VyVG9rZW5Nb2RlbC5maW5kT25lKHsgZW1haWw6IGVtYWlsIH0pO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChjaGVja190b2tlbikge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBhd2FpdCBVc2VyVG9rZW5Nb2RlbC5maW5kT25lQW5kVXBkYXRlKHsgZW1haWw6IGVtYWlsIH0sIHsgcmVmcmVzaFRva2VuIH0pO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY3JlYXRlVG9rZW4oVXNlclRva2VuTW9kZWwsIHsgZW1haWw6IGVtYWlsLCByZWZyZXNoVG9rZW4gfSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZWZyZXNoVG9rZW5cclxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIC8vIGNvbnN0IGRhdGEgPSBhd2FpdCBjcmVhdGVEYXRhKFVzZXJNb2RlbCwgcGF5bG9hZClcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IFwidHJ5IGFnaW5cIiB9KTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3IgfSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgc3RhdGljIGFzeW5jIHVzZXJSZWZyZXNoVG9rZW4ocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3JzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczogZXJyb3JzLmVycm9yc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVtYWlsLCByZWZyZXNoVG9rZW4gfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IFVzZXJUb2tlbk1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIHJlZnJlc2hUb2tlbjogcmVmcmVzaFRva2VuIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdXNlciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBqd3RUb2tlbi5zaWduKHVzZXIsIENvbmZpZy5qd3Quc2VjcmV0S2V5LCB7IGV4cGlyZXNJbjogQ29uZmlnLmp3dC5leHBEdXJhdGlvbiB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc2VuZCg0MDApLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIHJlZnJlc2hUb2tlblwiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnNlbmQoNTAwKS5qc29uKHsgZXJyb3IgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHVzZXJUb2tlbkRlbGV0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcclxuICAgICAgICAgICAgaWYgKCFlcnJvcnMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MjIpLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9ycy5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBlcnJvcnMuZXJyb3JzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgZW1haWwsIHJlZnJlc2hUb2tlbiB9ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBVc2VyVG9rZW5Nb2RlbC5maW5kT25lQW5kRGVsZXRlKHsgZW1haWw6IGVtYWlsLCByZWZyZXNoVG9rZW46IHJlZnJlc2hUb2tlbiB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zZW5kKDQwMCkuanNvbih7IGVycm9yOiBcIkludmFsaWQgcmVmcmVzaFRva2VuXCIgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc2VuZCgyMDApLmpzb24oeyBlcnJvcjogXCJkZWxldGUgcmVmcmVzaFRva2VuXCIgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdChyZXEsIHJlcykge1xyXG5cclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RVc2VyKHJlcT8ucXVlcnksIHJlcS5wYXJhbXMpXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKTtcclxuICAgICAgICAgICAgaWYgKCFlcnJvcnMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MjIpLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9ycy5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBlcnJvcnMuZXJyb3JzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLnNhdmVVc2VyKHJlcS5ib2R5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmRlbGV0ZVVzZXIocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcblxyXG59Il19