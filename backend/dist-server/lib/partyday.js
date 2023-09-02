"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartyDate = void 0;
var _dayjs = _interopRequireDefault(require("dayjs"));
var _customParseFormat = _interopRequireDefault(require("dayjs/plugin/customParseFormat"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                               Маленькие утилиты для работы с датой и временем в специфике Междусобойчика
                                                                                                                                                                                                                                                                                                                                                                                               Это дата и время в форматах:
                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                               "DD.MM.YY HH:mm:ss"
                                                                                                                                                                                                                                                                                                                                                                                               "DD.MM.YY HH:mm" 
                                                                                                                                                                                                                                                                                                                                                                                               "DD.MM.YY"
                                                                                                                                                                                                                                                                                                                                                                                              */
_dayjs["default"].extend(_customParseFormat["default"]);
var datetimeFormat = "DD.MM.YY HH:mm:ss";
var dateFormat = "DD.MM.YY";
var PartyDate = /*#__PURE__*/function () {
  function PartyDate() {
    _classCallCheck(this, PartyDate);
  }
  _createClass(PartyDate, null, [{
    key: "toTS",
    value:
    /*
    Получить timestamp – количество секунд, прошедших с 1 января 1970 года UTC+0.
    из строки в формате datetimeFormat
    */
    function toTS(ts_str) {
      return (0, _dayjs["default"])(ts_str, datetimeFormat).unix();
    }

    /*
    Получить из timestamp строку в формате datetimeFormat
    */
  }, {
    key: "fromTS",
    value: function fromTS(ts) {
      return _dayjs["default"].unix(ts).format(datetimeFormat);
    }

    /*
    Получить timestamp – количество секунд, прошедших с 1 января 1970 года UTC+0.
    из строки в формате 'DD.MM.YY' т.е. часы, минуты, секунды равны 0
    */
  }, {
    key: "dateToTS",
    value: function dateToTS(ts_str) {
      return (0, _dayjs["default"])(ts_str, dateFormat).unix();
    }

    /*
    Получить из timestamp строку в формате dateFormat
    */
  }, {
    key: "dateFromTS",
    value: function dateFromTS(ts) {
      return _dayjs["default"].unix(ts).format(dateFormat);
    }

    /* Получить текущую дату в timestamp, при это часы, минуты, секунды равны 0
    */
  }, {
    key: "getCurrDate",
    value: function getCurrDate() {
      return (0, _dayjs["default"])().set('hour', 0).set('minute', 0).set('second', 0).unix();
    }
  }]);
  return PartyDate;
}();
exports.PartyDate = PartyDate;