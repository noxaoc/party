"use strict";

var _participant = require("../participant.js");
var R = _interopRequireWildcard(require("ramda"));
var _record = require("../../lib/record.js");
var _partyday = require("../../lib/partyday.js");
var _errors = require("../lib/errors.js");
var _testhdl = require("./lib/testhdl.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
describe("Participant.update", function () {
  // оптимистичное обновление
  test("Participant.update(rec)", function (done) {
    var rec = {
      "pkID": 1,
      "fkParty": 1,
      "num": 12,
      "surname": "Букин",
      "patronymic": "Власович",
      "name": "Святослав",
      "phone": "+7(960)978-77-77",
      "email": "svg@gmail.com",
      "dtReg": _partyday.PartyDate.toTS("06.03.23 00:12:00"),
      "club": "Savoy",
      "role": "leader",
      "price": 6000,
      "paid": 3000,
      "comment": "Обратить внимание"
    };
    var checkF = function checkF(updated) {
      expect(updated).toEqual(1);
      // проверяем совпадение того что записали
      _participant.Participant.read({
        pkID: 1,
        fkParty: 1
      }, (0, _testhdl.makeCheckReadHdl)(done, rec));
    };
    _participant.Participant.update(rec, (0, _testhdl.makeHdl)(done, checkF));
  });

  // обновляем с fkParty = undefined
  test("Participant.update({pkID:1})", function (done) {
    var rec = {
      "pkID": 1,
      "num": 12
    };
    _participant.Participant.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // обновляем с fkParty = null
  test("Participant.update(fkParty:null,pkID:1)", function (done) {
    var rec = {
      "pkID": 1,
      fkParty: null,
      "num": 12
    };
    _participant.Participant.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // обновляем с pkID = null
  test("Participant.update({pkID:null, fkParty:1})", function (done) {
    var rec = {
      "pkID": null,
      fkParty: 1,
      "num": 12
    };
    _participant.Participant.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // обновляем с pkID = undefined
  test("Participant.update({fkParty:1})", function (done) {
    var rec = {
      "fkParty": 1,
      "num": 12
    };
    _participant.Participant.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
});
describe("Participant.remove", function () {
  // Оптимистичный сценарий удаления существующей записи
  test("Participant.remove({ids:[1],fkParty:1})", function (done) {
    var rec = {
      ids: [1],
      fkParty: 1
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, function (removed) {
      return expect(removed).toEqual(1);
    }));
  });

  // удаление записи c несколькими ids
  test("Participant.remove({ids:[7,8], fkParty:1})", function (done) {
    var rec = {
      ids: [7, 8],
      fkParty: 1
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, function (removed) {
      return expect(removed).toEqual(2);
    }));
  });

  // удаление записи без fkParty
  test("Participant.remove({ids:[3]})", function (done) {
    var rec = {
      ids: [3]
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // удаление записи c пустым ids
  test("Participant.remove({ids:[], fkParty:1})", function (done) {
    var rec = {
      ids: [],
      fkParty: 1
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotEmptyValueErr);
    }));
  });

  // удаление записи без ids
  test("Participant.remove({fkParty:1})", function (done) {
    var rec = {
      fkParty: 1
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotUndefinedValueErr);
    }));
  });
  // удаление записи c ids = null
  test("Participant.remove({ids:null,fkParty:1})", function (done) {
    var rec = {
      ids: null,
      fkParty: 1
    };
    _participant.Participant.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotNullValueErr);
    }));
  });
});
describe("Participnat.insert", function () {
  // Оптимистичная вставка участника    
  test("Participant.insert(rec)", function (done) {
    var rec = {
      "fkParty": 1,
      "num": 22,
      "surname": "Лосев",
      "patronymic": "Власович",
      "name": "Святослав",
      "phone": "+7(960)999-99-99",
      "email": "css@gmail.com",
      "dtReg": _partyday.PartyDate.toTS("07.03.23 11:12:00"),
      "club": "Cotton Club",
      "role": "leader",
      "price": 6010,
      "paid": 2000,
      "comment": "Ничего"
    };
    var checkF = function checkF(id) {
      expect(id).toBeGreaterThan(0);
      _participant.Participant.read({
        pkID: id,
        fkParty: 1
      }, (0, _testhdl.makeCheckReadHdl)(done, _objectSpread(_objectSpread({}, rec), {}, {
        pkID: id
      })));
    };
    _participant.Participant.insert(rec, (0, _testhdl.makeHdl)(done, checkF));
  });
  test("Participant.insert({ fkParty: null, name: Вася })", function (done) {
    var rec = {
      "fkParty": null,
      name: "Вася"
    };
    _participant.Participant.insert(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });
  test("Participant.insert({ name: Вася })", function (done) {
    var rec = {
      name: "Вася"
    };
    _participant.Participant.insert(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
});
describe("Participant.init", function () {
  // оптимистичная инициализация    
  test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        name: "Беларусь",
        fkParty: 1
      },
      method: "Participant.list"
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.name).toEqual("Беларусь");
      expect(rec.fkParty).toEqual(1);
      expect(rec.pkID).toBeUndefined();
    };
    _participant.Participant.init(initRec, (0, _testhdl.makeHdl)(done, checkF));
  });

  // fkParty = undefined   
  test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        name: "Беларусь"
      },
      method: "Participant.list"
    };
    _participant.Participant.init(initRec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // fkParty = null  
  test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        name: "Беларусь",
        fkParty: null
      },
      method: "Participant.list"
    };
    _participant.Participant.init(initRec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });
});
describe("Participant.list", function () {
  // оптимистичный  список
  test("Participant.list({ids:[],fkParty:1})", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: 1
      }
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, function (rSet) {
      return expect(R.length(rSet)).toEqual(7);
    }));
  });
  test("Participant.list({ids:[]})", function (done) {
    var filter = {
      filter: {
        ids: []
      }
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
  test("Participant.list({ids:[],fkParty:1})", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: null
      }
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // чтение списка по фильтру отбирающему одну запись
  test("Participant.list({ids:[9],fkParty:1})", function (done) {
    var filter = {
      filter: {
        ids: [9],
        fkParty: 1
      }
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(2);
      var rc0 = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rc0.pkID).toEqual(9);
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, checkF));
  });

  // чтение списка по фильтру отбирающему 2 записи
  test("Participant.list({ids:[9,10],fkParty:1})", function (done) {
    var filter = {
      filter: {
        ids: [9, 10],
        fkParty: 1
      }
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(3);
      var rc0 = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rc0.pkID).toEqual(9);
      var rc1 = (0, _record.makePlainObjByIdx)(rSet, 1);
      expect(rc1.pkID).toEqual(10);
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, checkF));
  });

  // чтение списка по фильтру отбирающему запись по имени
  test("Participant.list({searchStr, fkParty:1})", function (done) {
    var filter = {
      filter: {
        searchStr: "Миши",
        fkParty: 1
      }
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(2);
      var rc = (0, _record.makePlainObjByIdx)(rSet);
      expect(rc.surname).toEqual("Мишин");
    };
    _participant.Participant.list(filter, (0, _testhdl.makeHdl)(done, checkF));
  });
});
describe("Participant.read", function () {
  // оптимистичное чтение
  test("Participant.read({pkID:3,fkParty:1})", function (done) {
    var checkF = function checkF(rSet) {
      expect(R.isNil(rSet)).toBeFalsy();
      expect(R.length(rSet)).toEqual(2);
      var rc = (0, _record.makePlainObjByIdx)(rSet);
      expect(rc.pkID).toEqual(3);
    };
    _participant.Participant.read({
      pkID: 3,
      fkParty: 1
    }, (0, _testhdl.makeHdl)(done, checkF));
  });

  // fkParty = null
  test("Participant.read({pkID:3,fkParty:null})", function (done) {
    _participant.Participant.read({
      pkID: 3,
      fkParty: null
    }, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // fkParty = undefined
  test("Participant.read({pkID:3,})", function (done) {
    _participant.Participant.read({
      pkID: 3
    }, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // pkID = undefined
  test("Participant.read({ fkParty: 1})", function (done) {
    _participant.Participant.read({
      fkParty: 1
    }, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // pkID = null
  test("Participant.read({pkID:null,fkParty:null})", function (done) {
    _participant.Participant.read({
      pkID: null,
      fkParty: null
    }, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  //  чтение несуществующей записи
  test("Participant.read({pkID:100})", function (done) {
    _participant.Participant.read({
      pkID: 100,
      fkParty: 1
    }, (0, _testhdl.makeHdl)(done, _testhdl.recordDoesNotExistHdl));
  });
});