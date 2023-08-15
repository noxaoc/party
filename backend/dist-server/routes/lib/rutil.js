"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRoutes = void 0;
var fs = _interopRequireWildcard(require("node:fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Утилиты для формирования маршрутов
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
/*
В папку webfuncs кладутся модули с экспортируемыми функциями связываемыми с маршрутами
во время старта приложения для каждого модуля и его функций создается маршрут формата
":url_path/:module_name/:func_name" где
:module_name - имя модуля
func_name - название фнукции
url_path - общий url - путь, например, "/party"
fpath - путь до папки где лежат модули с экспортируемыми web - функциями
*/
var makeRoutes = function makeRoutes(express, app, url_path, fpath) {
  var fnames = fs.readdirSync(fpath);
  // obj - экспортируемый  по умолчанию объект модуля к объекту привязаны функции
  var createRoute = function createRoute(obj, module_name) {
    var router = express.Router();
    for (var func_name in obj) {
      router.post('/' + func_name, obj[func_name]);
      router.get('/' + func_name, obj[func_name]);
    }
    console.log(url_path + '/' + module_name);
    app.use(url_path + '/' + module_name, router);
  };
  var makeRoute = function makeRoute(fname) {
    var mname = fpath + '/' + fname;
    var module_name = _path["default"].basename(fname, '.js');
    return function (specifier) {
      return new Promise(function (r) {
        return r("".concat(specifier));
      }).then(function (s) {
        return _interopRequireWildcard(require(s));
      });
    }(mname).then(function (obj) {
      return createRoute(obj, module_name);
    })["catch"](function (err) {
      return console.log("\u041C\u043E\u0434\u0443\u043B\u044C ".concat(mname, " \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C! \u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 ").concat(err, "."));
    });
  };
  Promise.all(fnames.map(makeRoute));
};
exports.makeRoutes = makeRoutes;