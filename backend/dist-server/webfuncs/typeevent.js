"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = void 0;
var _typeevent = require("../models/typeevent");
var _response = require("../lib/response");
var all = function all(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_typeevent.TypeEventParty.all, req.body, res);
};
exports.all = all;