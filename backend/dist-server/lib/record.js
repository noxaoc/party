"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRecord = addRecord;
exports.emptyRSet = emptyRSet;
exports.getFldName = getFldName;
exports.getFldType = getFldType;
exports.getFrmtRSet = getFrmtRSet;
exports.lengthRSet = lengthRSet;
exports.makePlainObj = makePlainObj;
exports.makeRecordSet = makeRecordSet;
exports.mapRSet = mapRSet;
var _partyday = require("./partyday");
var R = _interopRequireWildcard(require("ramda"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*


EffectiveRecord  - объект предназначенный для передачи по сети
имеет формат массива из многих элементов
0 - элемент это всегда массив форматов полей, чьи значения переданы в последкющих элементах
>0 - элементы массивов значений полей, чьи форматы описаны  в элементе 0
индекс формата поля и индекс значения совпадают в массивах их элементов
[
   [ [<fld_name>, <value_type>, <типозависимые значения>],  ],
   [ <value>, ],
]

где 
fld_name - имя поля
value - значение поля
value_type - тип поля
допустимые типы полей:
n - целое число
r -  вещественное число
s - строка
t -  timestamp
d - дата
tm - время

Format -  объект описывающий формат полей
формат нам необходим для интерпретации так как json не содержит всех необходимых типов
Record - объект
*/

var RSET_FORMAT = 0; // формат RSET
var FLD_NAME = 0;
var FLD_TYPE = 1;
function getFldName(frmt) {
  return frmt[FLD_NAME];
}
function getFldType(frmt) {
  return frmt[FLD_TYPE];
}
function makeRecordSet(frmt) {
  var checkFrmtFld = function checkFrmtFld(frmt_fld) {
    if (R.length(frmt_fld) < 2) throw 'Неверно сконструированный формат!';
    // проверить допустимый тип еще надо
    return false;
  };
  R.find(checkFrmtFld, frmt);
  return [frmt];
}
function addRecord(rSet, db_rec) {
  var makeFld = function makeFld(fld_frmt) {
    var fld = db_rec[fld_frmt[FLD_NAME]];
    return fld === undefined ? null : fld;
  };
  var rec = R.map(makeFld, rSet[RSET_FORMAT]);
  rSet.push(rec);
}
function emptyRSet(rSet) {
  return lengthDataRSet(rSet) === 0;
}
function lengthRSet(rSet) {
  var length = R.length(rSet) - 1;
  return length < 0 ? 0 : length;
}

/*
Получит формат RecordSet
*/
function getFrmtRSet(rSet) {
  return rSet[RSET_FORMAT];
}

/*

Сигнатура 
hdl = ( rec, frmt )=>...
*/
function mapRSet(hdl, rSet) {
  if (emptyRSet(rSet)) return [];
  var result = [];
  var rSetFormat = getFrmtRSet(rSet);
  var localHdl = function localHdl(rec, idx) {
    if (idx > 0) result.push(hdl(rec, rSetFormat));
  };
  rSet.forEach(localHdl);
  return result;
}
function makePlainObj(rec, frmt) {
  var pobj = {};
  var fldHdl = function fldHdl(ffrmt, idx) {
    switch (getFldType(ffrmt)) {
      case "t":
        pobj[getFldName(ffrmt)] = _partyday.PartyDate.fromTS(rec[idx]);
        break;
      default:
        pobj[getFldName(ffrmt)] = rec[idx];
        break;
    }
  };
  frmt.forEach(fldHdl);
  return pobj;
}