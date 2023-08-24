"use strict";

var _dbschema = require("../sqlite/dbschema.js");
var _partyday = require("../../lib/partyday.js");
//import * as R from 'ramda'

test("DBEventParty.update(rec}", function (done) {
  var rec = {
    pkID: 1,
    name: "Cултаны Свинга 2025",
    dtStart: _partyday.PartyDate.toTS('13.09.23 11:00:00'),
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
test("DBEventParty.remove({pid:1,ids:[1]}", function (done) {
  var rec = {
    pid: 1,
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