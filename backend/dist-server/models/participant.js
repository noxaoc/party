"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = void 0;
var R = _interopRequireWildcard(require("ramda"));
var _dbschema = require("./sqlite/dbschema.js");
var _record = require("../lib/record.js");
var _partyday = require("../lib/partyday.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function makeParticipant() {
  /**
   * 
   * @param {*} ext 
   * @param {*} filter  - задает фильтрацию  списка 
   *                        { searchStr:<подстрока поиска по имени>}
   * @param {*} ord  - задает сортировку списка
   * @param {*} nav  - задает навигацию списка 
   *                    { page: <номер страницы>, 
   *                      cnt:< кол - во записей на странице> }
   * @returns RecordSet
   */
  function list(rec, respHdl) {
    var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['fkParty', 'n'], ['num', 'n'], ['name', 's'], ['surname', 's'], ['patronymic', 's'], ['club', 's'], ['email', 's'], ['phone', 's'], ['dtReg', 'd'], ['role', 's'], ['price', 'n'], ['paid', 'n'], ['comment', 's']]);
    _dbschema.DBParticipant.list(rs, rec.filter, rec.ord, rec.nav, respHdl);
  }

  /*
  * Сконструировать пустую запись
  * { "initRec": initRec, "method":method, "insImmediatly": insImmediatly }
  * initRec -  поля для инициализации записи
  * method -  имя метода чей формат нам  нужно возвратить при инициализации
  * insImmediatly - сразу добавить запись
  * Возвращает: запись формата метода чье имя передано в method
  */
  function init(_ref, respHdl) {
    var initRec = _ref.initRec,
      method = _ref.method,
      insImmediatly = _ref.insImmediatly;
    if (R.isNil(initRec.fkParty)) {
      respHdl(new Error("Невозможно выполнить инициализацию записи, так как не задано поле 'fkParty'!"));
      return;
    }
    var rs = (0, _record.makeRecordSet)([['fkParty', 'n'], ['num', 'n'], ['name', 's'], ['surname', 's'], ['patronymic', 's'], ['club', 's'], ['email', 's'], ['phone', 's'], ['dtReg', 'd'], ['role', 's'], ['price', 'n'], ['paid', 'n'], ['comment', 's']]);
    var newRec = _objectSpread({
      name: "",
      suranme: "",
      patronymic: "",
      dtReg: _partyday.PartyDate.getCurrDate(),
      phone: "",
      club: "",
      email: "",
      role: "leader",
      price: 0,
      paid: 0,
      comment: ""
    }, initRec);
    if (R.isNotNil(insImmediatly) && insImmediatly === true) {
      var respIns = function respIns(err, id) {
        if (R.isNotNil(err)) {
          respHdl(err, null);
          return;
        }
        console.log("id=".concat(id));
        list({
          filter: {
            ids: [id]
          },
          ord: null,
          nav: null
        }, respHdl);
      };
      insert(newRec, respIns);
    } else {
      (0, _record.addRecord)(rs, newRec);
      respHdl(null, rs);
    }
  }

  /**
   * Прочитать по идентификатору событие между собойчика
   * @param {*} rec запись в которой обязательно присутствует pkID  - идентификатор события и 
   *                      идентификатор междусобойчика filter.fkPartyID
   * @param {*} respHdl 
   * * @returns RecordSet из 1 записи
   */
  function read(rec, respHdl) {
    if (R.isNil(rec.pkID)) {
      respHdl(null, null);
      return;
    }
    var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['fkParty', 'n'], ['num', 'n'], ['name', 's'], ['surname', 's'], ['patronymic', 's'], ['club', 's'], ['email', 's'], ['phone', 's'], ['dtReg', 'd'], ['role', 's'], ['price', 'n'], ['paid', 'n'], ['comment', 's']]);
    _dbschema.DBParticipant.read(rs, rec, respHdl);
  }

  /*
  * @param rec формат
  {
      ids: [ <список id на удаление междусобойчика> ]
  }
  * @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
  */
  function remove(rec, respHdl) {
    if (R.isNil(rec.ids) || R.isEmpty(rec.ids) || R.isNil(rec.fkParty)) {
      respHdl(null, 0);
      return;
    }
    _dbschema.DBParticipant.remove(rec, respHdl);
  }

  /* Добавить запись о событии междусобойчика   
  * @param {*} rec обычного формата {name, description, fkParty ...}
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    _dbschema.DBParticipant.insert(rec, respHdl);
  }

  /* Обновить запись события междусобойчика   
  * @param {*} rec запись {pkID, name, ... }
  * @param {*} respHdl (err, res) в res будет кол-во обновленных записей, т.е. единица
  */
  function update(rec, respHdl) {
    _dbschema.DBParticipant.update(rec, respHdl);
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update,
    init: init
  });
}
var Participant = makeParticipant();
exports.Participant = Participant;