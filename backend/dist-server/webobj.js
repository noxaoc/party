"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execWebFunc = exports.addWebFunc = void 0;
/* собираем все функции в глобальный объект  webFuncs и зовем их оттуда
формат объекта
ключ: __<module_name>__<func_name>
значение: ccылка на функцию
*/

var webFuncs = {};
/*
Подчеркивание добавляем чтобы не могли позвать произвольную функцию
*/
var addWebFunc = function addWebFunc(module_name, func_name, web_func) {
  webFuncs['__' + module_name + '__' + func_name] = web_func;
};

/*
Выполнить web - функцию
*/
exports.addWebFunc = addWebFunc;
var execWebFunc = function execWebFunc(module_name, func_name) {
  var web_func = webFuncs['__' + module_name + '__' + func_name];
  if (web_func) web_func();
};
exports.execWebFunc = execWebFunc;