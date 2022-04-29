"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class UserService {
  constructor() {// super()
  }

  async createData(model, data) {
    return new Promise((resolve, reject) => {
      model.create(data, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

}

exports.default = UserService;