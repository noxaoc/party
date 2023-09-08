"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRec = exports.checkPkID = exports.checkIsNilFld = exports.checkIsEmptyFld = exports.checkIds = exports.checkFkParty = void 0;
var _ramda = require("ramda");
var _errors = require("./errors");
/*
* Утилиты для моделей
*/

/**
 * Проверить, что свойство с именем name являющееся массивом или строкой  или объектом не пустое
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство имеет пустое значение, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
var checkIsEmptyFld = function checkIsEmptyFld(rec, name, hdl) {
  if ((0, _ramda.isEmpty)(rec[name])) {
    hdl(new _errors.NotEmptyValueErr(name));
    return false;
  }
  return true;
};

/**
 * Проверить, что свойство с именем name в rec не null и не undefined
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
exports.checkIsEmptyFld = checkIsEmptyFld;
var checkIsNilFld = function checkIsNilFld(rec, name, hdl) {
  if (rec[name] === undefined) {
    hdl(new _errors.NotUndefinedValueErr(name));
    return false;
  }
  if (rec[name] === null) {
    hdl(new _errors.NotNullValueErr(name));
    return false;
  }
  return true;
};

/**
 * Проверить, что fkParty в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если fkParty null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
exports.checkIsNilFld = checkIsNilFld;
var checkFkParty = function checkFkParty(rec, hdl) {
  return checkIsNilFld(rec, 'fkParty', hdl);
};
/**
 * Проверить, что pkID в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если pkID null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
exports.checkFkParty = checkFkParty;
var checkPkID = function checkPkID(rec, hdl) {
  return checkIsNilFld(rec, 'pkID', hdl);
};
/**
 * Проверить, что pkID и fkID в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если pkID или fkID null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
exports.checkPkID = checkPkID;
var checkRec = function checkRec(rec, hdl) {
  return checkPkID(rec, hdl) && checkFkParty(rec, hdl);
};

/**
 * Проверить, что свойство с именем ids являющееся массивом не пустое и не null
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство имеет пустое значение, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
exports.checkRec = checkRec;
var checkIds = function checkIds(rec, hdl) {
  return checkIsNilFld(rec, 'ids', hdl) && checkIsEmptyFld(rec, 'ids', hdl);
};
exports.checkIds = checkIds;