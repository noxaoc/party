"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _dbschema = require("../sqlite/dbschema.js");
var _party = require("../party.js");
var R = _interopRequireWildcard(require("ramda"));
var _record = require("../../lib/record.js");
var _partyday = require("../../lib/partyday.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
test("DBParty.update(rec}", function (done) {
  var rec = {
    pkID: 1,
    name: "Cултаны Свинга 2025",
    dtStart: _partyday.PartyDate.toTS('13.09.23 11:00:00'),
    dtEnd: _partyday.PartyDate.toTS('15.09.23 11:00:00'),
    place: "Москва",
    outgoing: 5,
    payment: 100,
    profit: 95,
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
  _dbschema.DBParty.update(rec, resHdl);
});
test("DBParty.remove({ids:[1]})", function (done) {
  var rec = {
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
  _dbschema.DBParty.remove(rec, resHdl);
});
test("DBParty.insert(rec}", function (done) {
  var rec = {
    name: "LindyTime 2023",
    dtStart: _partyday.PartyDate.toTS('13.09.23 11:00:00'),
    dtEnd: _partyday.PartyDate.toTS('15.09.23 11:00:00'),
    place: "Москва",
    outgoing: 5,
    payment: 100,
    profit: 95,
    description: "Супер соревнования"
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
  _dbschema.DBParty.insert(rec, resHdl);
});
test("Party.init({initRec: initRec, method:list, insImmediatly: false })", function (done) {
  var initRec = {
    initRec: {
      place: "Беларусь"
    },
    method: "Party.list"
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(2);
      var rec = (0, _record.makePlainObjByIdx)(rSet, 0);
      expect(rec.place).toEqual("Беларусь");
      expect(rec.pkID).toBeNull();
      done();
    } catch (err) {
      done(err);
    }
  };
  _party.Party.init(initRec, resHdl);
});
test("DBParty.list({ids:[]})", function (done) {
  var filter = {
    ids: []
  };
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(3);
      done();
    } catch (err) {
      done(err);
    }
  };
  var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['name', 's'], ['description', 's'], ['place', 's'], ['dtStart', 'd'], ['dtEnd', 'd'], ['outgoing', 'n'], ['payment', 'n'], ['profit', 'n']]);
  _dbschema.DBParty.list(rs, filter, null, null, resHdl);
});
test("DBParty.read({pkID:2})", function (done) {
  var resHdl = function resHdl(err, rSet) {
    if (err) {
      done(err);
      return;
    }
    try {
      expect(R.length(rSet)).toEqual(2);
      var partyRec = (0, _record.makePlainObjByIdx)(rSet);
      expect(partyRec.pkID).toEqual(2);
      done();
    } catch (err) {
      done(err);
    }
  };
  var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['name', 's'], ['description', 's'], ['place', 's'], ['dtStart', 'd'], ['dtEnd', 'd'], ['outgoing', 'n'], ['payment', 'n'], ['profit', 'n']]);
  _dbschema.DBParty.read(rs, {
    pkID: 2
  }, resHdl);
});