"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _dbschema = require("../sqlite/dbschema.js");
var _eventparty = require("../eventparty.js");
var R = _interopRequireWildcard(require("ramda"));
var _record = require("../../lib/record.js");
var _partyday = require("../../lib/partyday.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//import * as R from 'ramda'

test("DBEventParty.update(rec}", function (done) {
  var rec = {
    pkID: 1,
    name: "Cултаны Свинга 2025",
    dtStart: _partyday.PartyDate.toTS('13.09.23 11:00:00'),
    fkParty: 1,
    description: "Супер соревнования"
  };
  var resHdl = function resHdl(err, updated) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(updated).toEqual(1);
      done();
    } catch (err) {
      done(err);
    }
  };
  _dbschema.DBEventParty.update(rec, resHdl);
});
test("DBEventParty.remove({fkParty:1,ids:[1]}", function (done) {
  var rec = {
    fkParty: 1,
    ids: [1]
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
  _dbschema.DBEventParty.remove(rec, resHdl);
});
test("DBEventParty.insert(rec}", function (done) {
  var rec = {
    name: "Cултаны Свинга 2023",
    dtStart: _partyday.PartyDate.toTS('13.10.23 11:00:00'),
    fkEventType: 1,
    fkParty: 1,
    description: "Класcные соревнования"
  };
  var resHdl = function resHdl(err, id) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(id).toBeGreaterThan(0);
      done();
    } catch (err) {
      done(err);
    }
  };
  _dbschema.DBEventParty.insert(rec, resHdl);
});
test("DBTypeEventParty.all", function (done) {
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(5);
      done();
    } catch (err) {
      done(err);
    }
  };
  var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['name', 's'], ['description', 's']]);
  _dbschema.DBTypeEventParty.all(rs, resHdl);
});
test("EventParty.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
  var initRec = {
    initRec: {
      fkParty: 1
    },
    method: "EventParty.list"
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.fkParty).toEqual(1);
      expect(rec.pkID).toBeNull();
      done();
    } catch (err) {
      done(err);
    }
  };
  _eventparty.EventParty.init(initRec, resHdl);
});
test("EventParty.init({initRec: initRec, method:list, insImmediatly: true })", function (done) {
  var initRec = {
    initRec: {
      fkParty: 1,
      fkTypeEvent: 1
    },
    method: "EventParty.list",
    insImmediatly: true
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      // console.log(rSet)
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.fkParty).toEqual(1);
      expect(rec.pkID).toBeGreaterThan(0);
      done();
    } catch (err) {
      done(err);
    }
  };
  _eventparty.EventParty.init(initRec, resHdl);
});