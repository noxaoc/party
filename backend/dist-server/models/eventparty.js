"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventParty = void 0;
var R = _interopRequireWildcard(require("ramda"));
var _dbschema = require("./sqlite/dbschema.js");
var _record = require("../lib/record.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function makeEventParty() {
  /**
   * 
   * @param {*} ext 
   * @param {*} filter  - задает фильтрацию  списка 
   *                        { pid:<pkParty>, // идентификатор междусобойчика
   *                          searchStr:<подстрока поиска по имени>}
   * @param {*} ord  - задает сортировку списка
   * @param {*} nav  - задает навигацию списка 
   *                    { page: <номер страницы>, 
   *                      cnt:< кол - во записей на странице> }
   * @returns RecordSet
   */
  function list(rec, respHdl) {
    if (R.isNil(rec.filter.pid)) throw 'Работа невозможна, так как не удалось определить идентификатор междусобойчика!';
    var rs = (0, _record.makeRecordSet)([['id', 'n'], ['name', 's'], ['description', 's'], ['evTypeName', 's'], ['dtStart', 't']]);
    _dbschema.DBEventParty.list(rs, rec.filter, rec.ord, rec.nav, respHdl);
  }

  /**
   * Прочитать по идентификатору событие между собойчика
   * @param {*} rec запись в которой обязательно присутствует id  - идентификатор события и 
   *                      идентификатор междусобойчика filter.pid
   * @param {*} respHdl 
   * * @returns RecordSet из 1 записи
   */
  function read(rec, respHdl) {
    if (R.isNil(rec.filter.pid)) throw 'Работа невозможна, так как не удалось определить идентификатор междусобойчика!';
    if (R.isNil(rec.filter.id)) respHdl(null, null);
    var rs = (0, _record.makeRecordSet)([['id', 'n'], ['name', 's'], ['description', 's'], ['evTypeName', 's'], ['dtStart', 't']]);
    _dbschema.DBEventParty.read(rs, rec.filter, respHdl);
  }
  function remove(rec, respHdl) {
    if (R.isNil(rec.filter.pid)) throw 'Работа невозможна, так как не удалось определить идентификатор междусобойчика!';
    if (R.isNil(rec.filter.ids) || R.isEmpty(rec.filter.ids)) respHdl(null, true);
    _dbschema.DBEventParty.remove(rec.filter, respHdl);
  }
  function insert() {
    console.log("call insrty");
  }
  function update() {
    console.log("call upadte");
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update
  });
}
var EventParty = makeEventParty();
exports.EventParty = EventParty;