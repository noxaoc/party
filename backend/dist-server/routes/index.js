"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _dbschema = require("../models/sqlite/dbschema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//var express = require('express');

var router = _express["default"].Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  (0, _dbschema.doTestSQL)();
  res.send('Welcome to Express');
});

//module.exports = router;
var _default = router;
exports["default"] = _default;