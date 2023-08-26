"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeEventParty = void 0;
var _dbschema = require("./sqlite/dbschema.js");
var _record = require("../lib/record.js");
function makeTypeEventParty() {
  function all(rec, respHdl) {
    var rs = (0, _record.makeRecordSet)([['pkID', 'n'], ['name', 's'], ['description', 's']]);
    _dbschema.DBTypeEventParty.all(rs, respHdl);
  }
  return Object.freeze({
    all: all
  });
}
var TypeEventParty = makeTypeEventParty();
exports.TypeEventParty = TypeEventParty;