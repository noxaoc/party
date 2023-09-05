"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.remove = exports.read = exports.list = exports.insert = exports.init = void 0;
var _participant = require("../models/participant");
var _response = require("../lib/response");
/*
{ "filter":{ "searchStr": "подстрока для поиска", "ids":[1,2]} }     
*/
var list = function list(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.list, req.body, res);
};

/*
{"pkID":1}
*/
exports.list = list;
var read = function read(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.read, req.body, res);
};

/*
{ "filter":{"ids":[1,2]} } 
       
*/
exports.read = read;
var remove = function remove(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.remove, req.body, res);
};

/*
{rec:{ "name":"", ...}}
*/
exports.remove = remove;
var insert = function insert(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.insert, req.body, res);
};

/*
{rec:{"pkID":1, "name":"", ...}}
*/
exports.insert = insert;
var update = function update(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.update, req.body, res);
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
var init = function init(req, res, next) {
  console.log(req.body);
  (0, _response.getResult)(_participant.Participant.init, req.body, res);
};
exports.init = init;