"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DBEventParty = void 0;
exports.Participant = Participant;
exports.doTestSQL = doTestSQL;
var _ramda = require("ramda");
var _partyday = require("../../lib/partyday");
var _record = require("../../lib/record");
/*
Создание схемы базы "Междусобойчика" в sqlite
*/

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var createParty = "create table party(\npkID integer primary key,\ndtStart int,\ndtEnd int,\nname text,\ndescription text)";
var createEvent = "create table event_party(\npkID integer primary key,\nfkEventType int,\nfkParty int,\ndtStart int,\nfree int,\nname text,\ndescription text)";
var createTypeEvent = "create table type_event(\npkID integer primary key,\nid text,\nname text,\ndescription text)";
var createPricesEvent = "create table price_event(\npkID integer primary key,\nname text,\nprice real)";

/* Генерируем данные
*/
var initPartyTable = "insert into party( name ) \nvalues ( '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' ),\n       ( 'Swingtown Little Cup 2023' )";
var initTypeEventTable = "insert into type_event( id, name ) \nvalues ( 'party', '\u0412\u0435\u0447\u0435\u0440\u0438\u043D\u043A\u0430' ),\n       ( 'lesson', '\u041B\u0435\u043A\u0446\u0438\u044F' ),\n       ( 'competition', 'C\u043E\u0440\u0435\u0432\u043D\u043E\u0432\u0430\u043D\u0438\u0435'),\n       ( 'masterClass', '\u041C\u0430\u0441\u0442\u0435\u0440-\u043A\u043B\u0430\u0441\u0441')";
var initPricesTable = "insert into price_event( 'name', 'price' ) \nvalues ( '\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0434\u043E 12.02.23', 20000 ),\n       ( \"\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u043F\u043E\u0441\u043B\u0435 12.02.23\", 23000 )";
var initEventTable = "insert into event_party( 'name', 'description', 'dtStart', 'fkEventType', 'fkParty' ) \n        values ( 'Mix&Match Kids', '\u0422\u0435\u043C\u043F 32-38 bpm', \n                 ".concat(_partyday.PartyDate.toTS('13.06.23 11:00:00'), ", \n                 (select pkID from type_event where id = 'competition'), \n                 (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' )),\n               ( 'Strictly Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.23 13:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' )),\n                ( 'Strictly Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.22 15:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ))");

/*
Создаем таблицы
*/
function initDatabase() {
  db.serialize(function () {
    db.run(createParty);
    db.run(createEvent);
    db.run(createTypeEvent);
    db.run(createPricesEvent);
    db.run(initPartyTable);
    db.run(initTypeEventTable);
    db.run(initPricesTable);
    db.run(initEventTable);
  });
}
initDatabase();
function doTestSQL() {
  /*
  db.serialize(() => {
      db.run(createParty);
  
      const stmt = db.prepare("INSERT INTO party VALUES (1, 'little cup' )");
      stmt.run()
      stmt.finalize();
  
      db.each("SELECT rowid AS id, pkParty, name FROM party", (err, row) => {
          console.log(`rowid = ${row.id} pkParty=${row.pkParty} name=${row.name}`);
      }); 
  });
  
  db.close();
  */
  db.each("SELECT pkID, name FROM party", function (err, row) {
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name));
  });
  db.each("SELECT pkID, id, name FROM type_event where pkID=3", function (err, row) {
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name, " id=").concat(row.id));
  });
  db.each("SELECT pkID, name, price FROM price_event ", function (err, row) {
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name, " price=").concat(row.price));
  });
  db.each("SELECT pkID, name, description, fkEventType, fkParty, dtStart \n        FROM event_party", function (err, row) {
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name, " descr=").concat(row.description, "\n    dtStart=").concat(_partyday.PartyDate.fromTS(row.dtStart), " fkEventType=").concat(row.fkEventType == undefined ? '' : row.fkEventType));
  });
  db.each("SELECT event_party.pkID as pkID, event_party.name as name, \n         event_party.description, type_event.name as type, fkParty, dtStart \n        FROM event_party \n        join type_event \n        on type_event.pkID = event_party.fkEventType", function (err, row) {
    console.log(err);
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name, " descr=").concat(row.description, "\n    dtStart=").concat(_partyday.PartyDate.fromTS(row.dtStart), " type=").concat(row.type));
  });
}

/* 
Основные запросы по таблице event_party 
*/
function makeEventParty() {
  /**
   *  Конструирование строки запроса для получения списка событий междусобойчика
   */
  function listQueryStr(filter, ord, nav) {
    return "select event_party.pkID as id, \n                    event_party.name as name, \n                    event_party.description as description, \n                    type_event.name as evTypeName, \n                    event_party.dtStart  as dtStart\n                from event_party \n                     join type_event \n                     on type_event.pkID = event_party.fkEventType\n                where fkParty = ".concat(filter.pid);
  }

  /**
   * 
   * @param {*} ext 
   * @param {*} filter  - задает фильтрацию  списка 
   *                        { pid:<pkParty>, // идентификатор междусобойчика
   *                          searchStr:<подстрока поиска по имени>}
   * @param {*} ord  - задает сортировку списка
   * @param {*} nav  - задает навигацию списка 
   *                    { page: <номер страницы>, 
   *                      cnt:< кол - во записей на странице> }
   * @returns RecordSet
   */
  function list(rs, filter, ord, nav, respHdl) {
    var getRow = function getRow(err, row) {
      return (0, _record.addRecord)(rs, row);
    };
    var query = listQueryStr(filter, ord, nav);
    db.each(query, getRow, function (err) {
      return respHdl(err, rs);
    });
  }
  function read(rs, filter, respHdl) {
    var getRow = function getRow(err, row) {
      (0, _record.addRecord)(rs, row);
      respHdl(rs);
    };
    var query = "select event_party.pkID as id, \n                           event_party.name as name, \n                           event_party.description as description, \n                           type_event.name as evTypeName, \n                           event_party.dtStart  as dtStart\n                    from event_party \n                        left join type_event \n                        on type_event.pkID = event_party.fkEventType\n                    where\n                        event_party.pkID =".concat(filter.id, " and event_party.fkParty =").concat(filter.pid);
    db.get(query, getRow);
  }
  function remove() {
    console.log("call remove");
  }
  function insert() {
    console.log("call insrty");
  }
  function update() {
    console.log("call upadte");
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update
  });
}
var DBEventParty = makeEventParty();
exports.DBEventParty = DBEventParty;
function Participant() {
  function list(ext, filter, ord, nav) {
    console.log("call list");
  }
  function read() {
    console.log("call read");
  }
  function remove() {
    console.log("call remove");
  }
  function insert() {
    console.log("call insrty");
  }
  function update() {
    console.log("call upadte");
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update
  });
}