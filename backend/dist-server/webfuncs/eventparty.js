"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.list = void 0;
var _eventparty = require("../models/eventparty");
var _response = require("../lib/response");
var list = function list(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.list, req.body, res);
};

/*
{"filter":{"pid":1,"id":1}}
*/
exports.list = list;
var read = function read(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.read, req.body, res);
};
exports.read = read;