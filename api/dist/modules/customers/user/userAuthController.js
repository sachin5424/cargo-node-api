"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRegister = exports.userOtpVerification = exports.userLoginWithMobile = exports.userForgetPassword = exports.profileUpdate = exports.profileDetails = exports.chnagePassword = void 0;

var _customer = _interopRequireDefault(require("../../../data-base/models/customer"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userRegister = async (req, res) => {
  try {
    const payload = req.body;
    var otp = Math.floor(100000 + Math.random() * 900000);
    otp = 1234; //String(otp);
    // otp = otp.substring(0,4);
    // console.log( "valor:" +a );

    let options = {
      firstName: payload.firstName,
      phoneNo: payload.phoneNo,
      email: payload.email,
      password: payload.password,
      emailOtp: parseInt(otp)
    };
    let newData = new _customer.default(options);
    let data = await newData.save();
    return res.status(200).json({
      status: 200,
      message: 'success ',
      data: {
        username: data.firstName + ' ' + data.lastName,
        phoneNo: data.phoneNo,
        email: data.email
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
};

exports.userRegister = userRegister;

const userOtpVerification = async (req, res) => {
  try {
    const payload = req.body;
    let options = {
      phoneNo: payload.phoneNo,
      otp: payload.otp
    };
    const user = await _customer.default.findOne(options);
    let userDetails = {};

    if (user) {
      userDetails['userId'] = user._id;
      userDetails['email'] = user.email || user.phoneNo;

      const token = _jsonwebtoken.default.sign(userDetails, 'testing', {
        expiresIn: '86765m'
      });

      return res.status(200).json({
        status: 200,
        message: "user login successfully",
        accessToken: token
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.userOtpVerification = userOtpVerification;

const userLoginWithMobile = async (req, res) => {
  try {
    const payload = req.body;
    let option = {
      phoneNo: payload.phoneNo
    };
    const user = await _customer.default.findOne(option);
    let userDetails = {};

    if (user) {
      userDetails['userId'] = user._id;
      userDetails['email'] = user.email || user.phoneNo;

      const token = _jsonwebtoken.default.sign(userDetails, 'testing', {
        expiresIn: '86765m'
      });

      return res.status(200).json({
        status: 200,
        message: "user login successfully",
        accessToken: token
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.userLoginWithMobile = userLoginWithMobile;

const userForgetPassword = async (req, res) => {
  try {
    const payload = req.body;
    let options = {
      phoneNo: payload.phoneNo
    };
    const user = await _customer.default.findOneAndUpdate(options, {
      emailOtp: "1234"
    });
    return res.status(200).json({
      status: 200,
      message: "otp sent"
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.userForgetPassword = userForgetPassword;

const chnagePassword = async (req, res) => {
  try {
    const payload = req.body;
    const salt = await _bcryptjs.default.genSalt(10);
    const password = await _bcryptjs.default.hash(payload.password, salt);
    await _customer.default.updateOne({
      phoneNo: payload.phoneNo
    }, {
      password
    });
    return res.status(200).json({
      status: 200,
      message: "password change successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.chnagePassword = chnagePassword;

const profileUpdate = async (req, res) => {
  try {
    const payload = req.body;
    const userId = req.userId;
    await _customer.default.updateOne({
      _id: userId
    }, payload);
    return res.status(200).json({
      status: 200,
      message: "profile updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.profileUpdate = profileUpdate;

const profileDetails = async (req, res) => {
  try {
    const data = await _customer.default.findOne({
      _id: req.userId
    }).select('email gender phoneNo');
    return res.status(200).json({
      status: 200,
      data
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.profileDetails = profileDetails;