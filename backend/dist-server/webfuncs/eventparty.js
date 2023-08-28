"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.remove = exports.read = exports.list = exports.insert = exports.init = void 0;
var _eventparty = require("../models/eventparty");
var _response = require("../lib/response");
var list = function list(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.list, req.body, res);
};

/*
{"filter":{"pid":1,"id":1}}
*/
exports.list = list;
var read = function read(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.read, req.body, res);
};

/*
{"filter":{"pid":1,"ids":[1,2]}}
*/
exports.read = read;
var remove = function remove(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.remove, req.body, res);
};

/*
{rec:{"pkParty":1,"name":"", ...}}
*/
exports.remove = remove;
var insert = function insert(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.insert, req.body, res);
};

/*
{rec:{"pkID":1, "pkParty":1,"name":"", ...}}
*/
exports.insert = insert;
var update = function update(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.update, req.body, res);
};

/*
* Сконструировать пустую запись
* { "initRec": initRec, "method":method, "insImmediatly": insImmediatly }
* initRec -  поля для инициализации записи
* method -  имя метода чей формат нам  нужно возвратить при инициализации
* insImmediatly - сразу добавить запись
* Возвращает: запись формата метода чье имя передано в method
*/
exports.update = update;
var init = function init(rec, respHdl) {
  console.log(req.body);
  (0, _response.getResult)(_eventparty.EventParty.init, req.body, res);
};
exports.init = init;