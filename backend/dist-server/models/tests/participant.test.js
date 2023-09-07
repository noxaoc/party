"use strict";

var _participant = require("../participant.js");
var R = _interopRequireWildcard(require("ramda"));
var _record = require("../../lib/record.js");
var _partyday = require("../../lib/partyday.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
*  Обработчик для сравнения образцовой записи rec с прочитанным результатом rSet
*/
var resReadHdl = function resReadHdl(rec, done) {
  return function (err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      var readRec = (0, _record.makePlainObjByIdx)(rSet);
      expect(readRec).toEqual(rec);
      done();
    } catch (err) {
      done(err);
    }
  };
};
var participantRead = function participantRead(filter, rec, done) {
  // проверяем совпадение того что записали
  _participant.Participant.read(filter, resReadHdl(rec, done));
};
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
  var resUpdHdl = function resUpdHdl(err, updated) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(updated).toEqual(1);
      // проверяем совпадение того что записали
      participantRead({
        pkID: 1,
        fkParty: 1
      }, rec, done);
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.update(rec, resUpdHdl);
});
test("Participant.remove({ids:[2],fkParty:1})", function (done) {
  var rec = {
    ids: [1],
    fkParty: 1
  };
  var resHdl = function resHdl(err, removed) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(removed).toEqual(1);
      done();
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.remove(rec, resHdl);
});
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
  var resInsHdl = function resInsHdl(err, id) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(id).toBeGreaterThan(0);
      participantRead({
        pkID: id,
        fkParty: 1
      }, _objectSpread(_objectSpread({}, rec), {}, {
        pkID: id
      }), done);
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.insert(rec, resInsHdl);
});
test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
  var initRec = {
    initRec: {
      name: "Беларусь",
      fkParty: 1
    },
    method: "Participant.list"
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.name).toEqual("Беларусь");
      expect(rec.fkParty).toEqual(1);
      expect(rec.pkID).toBeUndefined();
      done();
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.init(initRec, resHdl);
});
test("Participant.list({ids:[],fkParty:1})", function (done) {
  var filter = {
    filter: {
      ids: [],
      fkParty: 1
    }
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(9);
      done();
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.list(filter, resHdl);
});
test("Participant.read({pkID:1,fkParty:1})", function (done) {
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.isNil(rSet)).toBeFalsy();
      expect(R.length(rSet)).toEqual(2);
      console.log("Дошел до чтения");
      var partyRec = (0, _record.makePlainObjByIdx)(rSet);
      console.log(partyRec.pkID);
      expect(partyRec.pkID).toEqual(2);
      done();
    } catch (err) {
      done(err);
    }
  };
  _participant.Participant.read({
    pkID: 1,
    fkParty: 1
  }, resHdl);
});