"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doTestSQL = doTestSQL;
/*
Создание схемы базы "Междусобойчика" в sqlite
*/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var createParty = "create table party(\npkParty int primary key,\nname text)";
function doTestSQL() {
  db.serialize(function () {
    db.run(createParty);
    var stmt = db.prepare("INSERT INTO party VALUES (1, 'little cup' )");
    stmt.run();
    stmt.finalize();
    db.each("SELECT rowid AS id, pkParty, name FROM party", function (err, row) {
      console.log("rowid = ".concat(row.id, " pkParty=").concat(row.pkParty, " name=").concat(row.name));
    });
  });
  db.close();
}