"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listPaginate = exports.createToken = exports.createData = exports.aggregateFilter = exports.FindOne = void 0;

let createData = async (model, data) => {
  return new Promise((resolve, reject) => {
    model.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.createData = createData;

let createToken = async (model, data) => {
  return new Promise((resolve, reject) => {
    model.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}; // let listFind = async (model:any,data:UserInterface[]) =>{
// }


exports.createToken = createToken;

let FindOne = async (model, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findOne({
        value
      }).catch(err => {
        reject(err);
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

exports.FindOne = FindOne;

let listPaginate = async (model, query, options) => {
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
};

exports.listPaginate = listPaginate;

let aggregateFilter = async (model, filter) => {
  return new Promise((resolve, reject) => {
    model.aggregate(filter).exec(function (err, invites) {
      if (err) {
        reject(err);
      }

      resolve(invites);
    });
  });
};

exports.aggregateFilter = aggregateFilter;