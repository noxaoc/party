"use strict";

var _participant_event = require("../participant_event.js");
var R = _interopRequireWildcard(require("ramda"));
var _dbschema = require("../sqlite/dbschema.js");
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
describe("ParticipantEvent.update", function () {
  // оптимистичное обновление
  test("ParticipantEvent.update(rec)", function (done) {
    var rec = {
      pkID: 1,
      fkParty: 2,
      fkParticipant: 1,
      fkEvent: 1,
      comment: "test",
      price: 200,
      role: "follower"
    };
    var checkF = function checkF(updated) {
      expect(updated).toEqual(1);
      // проверяем совпадение того что записали
      _participant_event.ParticipantEvent.read({
        pkID: 1,
        fkParty: 2
      }, (0, _testhdl.makeCheckReadHdl)(done, rec));
    };
    _participant_event.ParticipantEvent.update(rec, (0, _testhdl.makeHdl)(done, checkF));
  });

  // обновляем с fkParty = undefined
  test("ParticipantEvent.update({pkID:1})", function (done) {
    var rec = {
      "pkID": 1,
      "price": 120
    };
    _participant_event.ParticipantEvent.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // обновляем с fkParty = null
  test("ParticipantEvent.update(fkParty:null,pkID:1)", function (done) {
    var rec = {
      "pkID": 1,
      fkParty: null,
      "price": 120
    };
    _participant_event.ParticipantEvent.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // обновляем с pkID = null
  test("ParticipantEvent.update({pkID:null, fkParty:2})", function (done) {
    var rec = {
      "pkID": null,
      fkParty: 2,
      "price": 12
    };
    _participant_event.ParticipantEvent.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // обновляем с pkID = undefined
  test("ParticipantEvent.update({fkParty:1})", function (done) {
    var rec = {
      "fkParty": 2,
      "price": 12
    };
    _participant_event.ParticipantEvent.update(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
});
describe("Participnat.insert", function () {
  // Оптимистичная вставка участника    
  test("ParticipantEvent.insert(rec)", function (done) {
    var rec = {
      fkParty: 2,
      fkParticipant: 1,
      fkEvent: 2,
      price: 333,
      role: "leader",
      comment: "И что?"
    };
    var checkF = function checkF(id) {
      expect(id).toBeGreaterThan(0);
      _participant_event.ParticipantEvent.read({
        pkID: id,
        fkParty: 2
      }, (0, _testhdl.makeCheckReadHdl)(done, _objectSpread(_objectSpread({}, rec), {}, {
        pkID: id
      })));
    };
    _participant_event.ParticipantEvent.insert(rec, (0, _testhdl.makeHdl)(done, checkF));
  });
  test("ParticipantEvent.insert({ fkParty: null, price: 111 })", function (done) {
    var rec = {
      "fkParty": null,
      price: 111
    };
    _participant_event.ParticipantEvent.insert(rec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });
  test("ParticipantEvent.insert({ price: 111 })", function (done) {
    var rec = {
      price: 111
    };
    _participant_event.ParticipantEvent.insert(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
});
describe("ParticipantEvent.init", function () {
  // оптимистичная инициализация    
  test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        price: 111,
        fkParty: 1,
        fkParticipant: 1
      },
      method: "ParticipantEvent.list"
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.price).toEqual(111);
      expect(rec.fkParty).toEqual(1);
      expect(rec.pkID).toBeUndefined();
      expect(rec.fkParticipant).toEqual(1);
    };
    _participant_event.ParticipantEvent.init(initRec, (0, _testhdl.makeHdl)(done, checkF));
  });

  // fkParty = undefined   
  test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        price: 333
      },
      method: "ParticipantEvent.list"
    };
    _participant_event.ParticipantEvent.init(initRec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // fkParty = null  
  test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
    var initRec = {
      initRec: {
        price: 333,
        fkParty: null
      },
      method: "ParticipantEvent.list"
    };
    _participant_event.ParticipantEvent.init(initRec, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });
});
describe("ParticipantEvent.list", function () {
  beforeEach(function (done) {
    console.log("Очищаю");
    _dbschema.DBTest.reInitDatabase(done);
  });

  // оптимистичный  список
  test("ParticipantEvent.list({ ids:[], fkParty:2, fkParticipant:1 })", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: 2,
        fkParticipant: 1
      }
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, function (rSet) {
      console.log(rSet);
      expect(R.length(rSet)).toEqual(3);
    }));
  });
  test("ParticipantEvent.list({ids:[]})", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParticipant: 1
      }
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });
  test("ParticipantEvent.list({ids:[],fkParty:null, fkParticipant:1})", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: null,
        fkParticipant: 1
      }
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // чтение списка по фильтру отбирающему одну запись
  test("ParticipantEvent.list({ids:[1],fkParty:2, fkParticipant:1})", function (done) {
    var filter = {
      filter: {
        ids: [1],
        fkParty: 2,
        fkParticipant: 1
      }
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(2);
      var rc0 = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rc0.pkID).toEqual(1);
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, checkF));
  });

  // чтение списка по фильтру c fkParticipant = null
  test("ParticipantEvent.list({ids:[],fkParty:2, fkParticipant:null})", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: 2,
        fkParticipant: null
      }
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // чтение списка по фильтру c fkParticipant = undefined
  test("ParticipantEvent.list({ids:[],fkParty:2 })", function (done) {
    var filter = {
      filter: {
        ids: [],
        fkParty: 2
      }
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // чтение списка по фильтру отбирающему 2 записи
  test("ParticipantEvent.list({ids:[1,2],fkParty:2, fkParticipant:1})", function (done) {
    var filter = {
      filter: {
        ids: [1, 2],
        fkParty: 2,
        fkParticipant: 1
      }
    };
    var checkF = function checkF(rSet) {
      expect(R.length(rSet)).toEqual(3);
      var rc0 = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rc0.pkID).toEqual(1);
      var rc1 = (0, _record.makePlainObjByIdx)(rSet, 1);
      expect(rc1.pkID).toEqual(2);
    };
    _participant_event.ParticipantEvent.list(filter, (0, _testhdl.makeHdl)(done, checkF));
  });
});
describe("ParticipantEvent.read", function () {
  // оптимистичное чтение
  test("ParticipantEvent.read({pkID:1,fkParty:2})", function (done) {
    var checkF = function checkF(rSet) {
      expect(R.isNil(rSet)).toBeFalsy();
      expect(R.length(rSet)).toEqual(2);
      var rc = (0, _record.makePlainObjByIdx)(rSet);
      expect(rc.pkID).toEqual(1);
    };
    _participant_event.ParticipantEvent.read({
      pkID: 1,
      fkParty: 2
    }, (0, _testhdl.makeHdl)(done, checkF));
  });

  // fkParty = null
  test("ParticipantEvent.read({pkID:1,fkParty:null})", function (done) {
    _participant_event.ParticipantEvent.read({
      pkID: 1,
      fkParty: null
    }, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  // fkParty = undefined
  test("ParticipantEvent.read({pkID:1})", function (done) {
    _participant_event.ParticipantEvent.read({
      pkID: 1
    }, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // pkID = undefined
  test("ParticipantEvent.read({ fkParty: 1})", function (done) {
    _participant_event.ParticipantEvent.read({
      fkParty: 2
    }, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // pkID = null
  test("ParticipantEvent.read({pkID:null,fkParty:null})", function (done) {
    _participant_event.ParticipantEvent.read({
      pkID: null,
      fkParty: null
    }, (0, _testhdl.makeHdl)(done, _testhdl.notNullValueHdl));
  });

  //  чтение несуществующей записи
  test("ParticipantEvent.read({pkID:100})", function (done) {
    _participant_event.ParticipantEvent.read({
      pkID: 100,
      fkParty: 2
    }, (0, _testhdl.makeHdl)(done, _testhdl.recordDoesNotExistHdl));
  });
});
describe("ParticipantEvent.remove", function () {
  // Оптимистичный сценарий удаления существующей записи
  test("ParticipantEvent.remove({ids:[2],fkParty:1})", function (done) {
    var rec = {
      ids: [2],
      fkParty: 2
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, function (removed) {
      return expect(removed).toEqual(1);
    }));
  });

  // удаление записи c несколькими ids
  test("ParticipantEvent.remove({ids:[3,4], fkParty:1})", function (done) {
    var rec = {
      ids: [3, 4],
      fkParty: 2
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, function (removed) {
      return expect(removed).toEqual(2);
    }));
  });

  // удаление записи без fkParty
  test("ParticipantEvent.remove({ids:[1]})", function (done) {
    var rec = {
      ids: [1]
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, _testhdl.notUndefinedValueHdl));
  });

  // удаление записи c пустым ids
  test("ParticipantEvent.remove({ids:[], fkParty:1})", function (done) {
    var rec = {
      ids: [],
      fkParty: 2
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotEmptyValueErr);
    }));
  });

  // удаление записи без ids
  test("ParticipantEvent.remove({fkParty:1})", function (done) {
    var rec = {
      fkParty: 2
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotUndefinedValueErr);
    }));
  });
  // удаление записи c ids = null
  test("ParticipantEvent.remove({ids:null,fkParty:1})", function (done) {
    var rec = {
      ids: null,
      fkParty: 2
    };
    _participant_event.ParticipantEvent.remove(rec, (0, _testhdl.makeHdl)(done, function (err) {
      return expect(err).toBeInstanceOf(_errors.NotNullValueErr);
    }));
  });
});