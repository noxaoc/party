"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRec = exports.checkPkID = exports.checkIsNilFld = exports.checkFkParty = void 0;
/*
* Утилиты для моделей
*/

/**
 * Проверить, что свойство с именем name в rec не null и не undefined
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
var checkIsNilFld = function checkIsNilFld(rec, name, hdl) {
  if (rec[name] === undefined) {
    hdl(new Error("\u041F\u043E\u043B\u0435 '".concat(name, "' \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C 'undefinded'!")));
    return false;
  }
  if (rec[name] === null) {
    hdl(new Error("\u041F\u043E\u043B\u0435 '".concat(name, "' \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C 'null'!")));
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
exports.checkRec = checkRec;