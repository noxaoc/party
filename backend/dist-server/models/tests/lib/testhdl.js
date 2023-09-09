"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordDoesNotExistHdl = exports.notUndefinedValueHdl = exports.notNullValueHdl = exports.notEmptyValueHdl = exports.makeHdl = exports.makeCheckReadHdl = void 0;
var _errors = require("../../lib/errors");
var _record = require("../../../lib/record");
/*
* Вспомогоательные обработчики
*/

var makeHdl = function makeHdl(done, expectFunc) {
  return function (err, res) {
    if (err) {
      if (err instanceof _errors.PartyErr) {
        expectFunc(err);
        done();
      } else done(err);
      return;
    }
    try {
      expectFunc(res);
      done();
    } catch (err) {
      done(err);
    }
  };
};

/*
* Обработчик на проверку null - значения
*/
exports.makeHdl = makeHdl;
var notNullValueHdl = function notNullValueHdl(err) {
  return expect(err).toBeInstanceOf(_errors.NotNullValueErr);
};

/*
* Обработчик на проверку undefined - значения
*/
exports.notNullValueHdl = notNullValueHdl;
var notUndefinedValueHdl = function notUndefinedValueHdl(err) {
  return expect(err).toBeInstanceOf(_errors.NotUndefinedValueErr);
};

/*
* Обработчик на проверку пустого - значения. {} для объектов, [] - для массивов, '' - для строк
*/
exports.notUndefinedValueHdl = notUndefinedValueHdl;
var notEmptyValueHdl = function notEmptyValueHdl(err) {
  return expect(err).toBeInstanceOf(_errors.NotEmptyValueErr);
};

/*
* Обработчик на проверку существования записи
*/
exports.notEmptyValueHdl = notEmptyValueHdl;
var recordDoesNotExistHdl = function recordDoesNotExistHdl(err) {
  return expect(err).toBeInstanceOf(_errors.RecordDoesNotExistErr);
};

/*
* обработчик сравнения прочитанных записей с образцом в rec для методов типа Object.read
*/
exports.recordDoesNotExistHdl = recordDoesNotExistHdl;
var makeCheckReadHdl = function makeCheckReadHdl(done, rec) {
  return makeHdl(done, function (rSet) {
    // проверяем совпадение того что записали
    var readRec = (0, _record.makeJSObjByIdx)(rSet, 0);
    expect(readRec).toEqual(rec);
  });
};
exports.makeCheckReadHdl = makeCheckReadHdl;