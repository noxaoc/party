"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _webobj = require("../webobj");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* 
Маршрут к сервису междусобойчика
*/

var router = _express["default"].Router();

//https://<домен>/<сервис>/<версия API>/<модуль>/<функция>?<параметры>

/* GET users listing. */
router.get('/:module/:func', function (req, res, next) {
  (0, _webobj.execWebFunc)(req.params.module, req.params.func);
  res.send("module=".concat(req.params.module, " func=").concat(req.params.func));
});
var _default = router;
exports["default"] = _default;