"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartyErr = exports.NotUndefinedValueErr = exports.NotNullValueErr = exports.NotEmptyValueErr = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/*
* Классы ошибок междусобойчика
*/
/* Ошибки окружения междусобойчика
*/
var PartyErr = /*#__PURE__*/function (_Error) {
  _inherits(PartyErr, _Error);
  var _super = _createSuper(PartyErr);
  function PartyErr(message) {
    _classCallCheck(this, PartyErr);
    return _super.call(this, message);
  }
  return _createClass(PartyErr);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/*
* У поля с именем fldName недопустимо null - значение
*/
exports.PartyErr = PartyErr;
var NotNullValueErr = /*#__PURE__*/function (_PartyErr) {
  _inherits(NotNullValueErr, _PartyErr);
  var _super2 = _createSuper(NotNullValueErr);
  function NotNullValueErr(fldName) {
    var _this;
    _classCallCheck(this, NotNullValueErr);
    _this = _super2.call(this, "\u041F\u043E\u043B\u0435 '".concat(fldName, "' \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C 'null'!"));
    _this.fldName = fldName;
    return _this;
  }
  return _createClass(NotNullValueErr);
}(PartyErr);
/*
* У поля с именем fldName недопустимо undefined - значение
*/
exports.NotNullValueErr = NotNullValueErr;
var NotEmptyValueErr = /*#__PURE__*/function (_PartyErr2) {
  _inherits(NotEmptyValueErr, _PartyErr2);
  var _super3 = _createSuper(NotEmptyValueErr);
  function NotEmptyValueErr(fldName) {
    var _this2;
    _classCallCheck(this, NotEmptyValueErr);
    _this2 = _super3.call(this, "\u041F\u043E\u043B\u0435 '".concat(fldName, "' \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C!"));
    _this2.fldName = fldName;
    return _this2;
  }
  return _createClass(NotEmptyValueErr);
}(PartyErr);
/*
* У поля с именем fldName недопустимо undefined - значение
*/
exports.NotEmptyValueErr = NotEmptyValueErr;
var NotUndefinedValueErr = /*#__PURE__*/function (_PartyErr3) {
  _inherits(NotUndefinedValueErr, _PartyErr3);
  var _super4 = _createSuper(NotUndefinedValueErr);
  function NotUndefinedValueErr(fldName) {
    var _this3;
    _classCallCheck(this, NotUndefinedValueErr);
    _this3 = _super4.call(this, "\u041F\u043E\u043B\u0435 '".concat(fldName, "' \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C 'undefined'!"));
    _this3.fldName = fldName;
    return _this3;
  }
  return _createClass(NotUndefinedValueErr);
}(PartyErr);
exports.NotUndefinedValueErr = NotUndefinedValueErr;