"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execWebFunc = exports.addWebFunc = void 0;
// собираем все функции
// в глобальный объект и зовем их оттуда

var webFuncs = {};
/*
Подчеркивание добавляем чтобы не могли позвать произвольную функцию
*/
var addWebFunc = function addWebFunc(module_name, func_name, web_func) {
  webFuncs['__' + module_name + '__' + func_name] = web_func;
};
exports.addWebFunc = addWebFunc;
var execWebFunc = function execWebFunc(module_name, func_name) {
  var web_func = webFuncs['__' + module_name + '__' + func_name];
  if (web_func) web_func();
};
exports.execWebFunc = execWebFunc;