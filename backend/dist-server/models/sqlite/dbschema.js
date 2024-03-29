"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DBTypeEventParty = exports.DBTest = exports.DBParty = exports.DBParticipantEvent = exports.DBParticipant = exports.DBEventParty = void 0;
exports.doTestSQL = doTestSQL;
var R = _interopRequireWildcard(require("ramda"));
var _partyday = require("../../lib/partyday");
var _record = require("../../lib/record");
var _testdata = require("../tests/testdata");
var _errors = require("../lib/errors");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
Создание схемы базы "Междусобойчика" в sqlite
*/

//import { resolveShowConfigPath } from '@babel/core/lib/config/files';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var createParty = "create table party(\npkID integer primary key,\nfkClient int,\ndtStart int,\ndtEnd int,\nname text,\ndescription text,\nplace text,\noutgoing float,\npayment float,\nprofit float\n)";
var createEvent = "create table event_party(\npkID integer primary key,\nfkTypeEvent int,\nfkParty int not null,\ndtStart int,\nfree int,\nname text,\nprice real,\ndescription text,\nforeign key ( fkParty ) references Party ( pkID ) )";
var createChangePrice = "create table change_price(\npkID integer primary key,\nfkParty int,\npercent int,\ndate int, \nforeign key ( fkParty ) references Party ( pkID ))";
var createTypeEvent = "create table type_event(\npkID integer primary key,\nid text,\nname text,\ndescription text)";
var createPriceEvent = "create table price_event(\npkID integer primary key,\nfkParty int,\nfkEvent int,\nname text,\nprice real)";
var createParticipant = "create table participant(\npkID integer primary key,\nname text,\nfkParty int not null,\nnum int,\nsurname text,\npatronymic text,\nphone text,\nemail text,\ndtReg int,\nclub text,\nrole text,\nprice real,\npaid real,\ncomment text,\nunique ( fkParty, num ),\nforeign key ( fkParty ) references Party ( pkID ) )";
var createParticipantEvent = "create table participant_event(\npkID integer primary key,\nfkEvent int,\nfkParticipant int,\nfkParty int,\nprice real,\nrole text,\ncomment text,\nforeign key ( fkParty ) references party ( pkID ),\nforeign key ( fkEvent, fkParty ) references event_party ( pkID, fkParty ),\nforeign key ( fkParticipant, fkParty ) references participant ( pkID, fkParty ) )";
var initParticipantTable = "insert into participant( name, fkParty, num, surname, patronymic, phone, email, dtReg, club, role, price, paid, comment)\nvalues ( $name, $fkParty, $num, $surname, $patronymic, $phone, $email, $dtReg, $club, $role, $price, $paid, $comment)";

/* Генерируем данные
*/
var initPartyTable = "insert into party( name, place, dtStart, dtEnd, outgoing, payment, profit, fkClient ) \nvalues ( 'Swingtown Little Cup 2023', '\u041C\u043E\u0441\u043A\u0432\u0430', \n         ".concat(_partyday.PartyDate.dateToTS('20.06.23'), ", \n         ").concat(_partyday.PartyDate.dateToTS('26.06.23'), ", 0,0,0,1 ),\n        ( '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430', '\u042F\u0440\u043E\u0441\u043B\u0430\u0432\u043B\u044C',  \n         ").concat(_partyday.PartyDate.dateToTS('13.06.23'), ", \n         ").concat(_partyday.PartyDate.dateToTS('16.06.23'), ",0,0,0,1 )");
var initTypeEventTable = "insert into type_event( id, name ) \nvalues ( 'party', '\u0412\u0435\u0447\u0435\u0440\u0438\u043D\u043A\u0430' ),\n       ( 'lesson', '\u041B\u0435\u043A\u0446\u0438\u044F' ),\n       ( 'competition', 'C\u043E\u0440\u0435\u0432\u043D\u043E\u0432\u0430\u043D\u0438\u0435'),\n       ( 'masterClass', '\u041C\u0430\u0441\u0442\u0435\u0440-\u043A\u043B\u0430\u0441\u0441')";
var initPriceTable = "insert into price_event( 'name', 'price' ) \nvalues ( '\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0434\u043E 12.02.23', 20000 ),\n       ( \"\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u043F\u043E\u0441\u043B\u0435 12.02.23\", 23000 )";
var initChangePriceTable = "insert into change_price( 'date', 'percent', 'fkParty' ) \nvalues ( ".concat(_partyday.PartyDate.toTS('13.06.23 11:00:00'), ", 10, (select pkID from party where name = 'Swingtown Little Cup 2023' ) ),\n       ( ").concat(_partyday.PartyDate.toTS('13.06.23 11:00:00'), ", 15, (select pkID from party where name = 'Swingtown Little Cup 2023' ) )");
var initEventTable = "insert into event_party( 'name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price' ) \n        values ( 'Mix&Match Kinders', '\u0422\u0435\u043C\u043F 32-38 bpm', \n                 ".concat(_partyday.PartyDate.toTS('13.06.23 11:00:00'), ", \n                 (select pkID from type_event where id = 'competition'), \n                 (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' ), 1000),\n               ( 'Strictly Kinders', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.23 13:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' ), 1000),\n                ( 'Strictly Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.22 15:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1700),\n                ( 'Big Little', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('14.06.22 16:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 2500),\n                ( 'Mix&Match Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.22 17:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1600),\n                ( 'Mix&Match Junior', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.22 18:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1300)");
var initParticipantEventTable = "insert into participant_event( 'fkParticipant', 'fkEvent', 'comment', 'role', 'price', 'fkParty' ) \n        values ( (select pkID from participant where name = $name limit 1 ),\n                 (select pkID from event_party where name = $eventName limit 1), \n                 $comment,\n                 $role,\n                 $price,\n                 (select pkID from party where name = $partyName limit 1 ) )";
function delTables() {
  var tbls = ['participant_event', 'participant', 'price_event', 'type_event', 'event_party'];
  var delTbl = function delTbl(name) {
    return db.run("delete from ".concat(name));
  };
  R.forEach(delTbl, tbls);
}
function makeTestDB() {
  function reInitDatabase(done) {
    db.serialize(function () {
      delTables();
      initData();
      db.run("select * from event_party limit 1", function (err, row) {
        return done();
      });
    });
  }
  return Object.freeze({
    reInitDatabase: reInitDatabase
  });
}

/*
    Создаем таблицы
*/
function createDatabase() {
  var stmts = [createParty, createEvent, createTypeEvent, createPriceEvent, createParticipant, createParticipantEvent, createChangePrice];
  var createTbl = function createTbl(stmt) {
    return db.run(stmt);
  };
  R.forEach(createTbl, stmts);
}

/*
    Проинициализировать базу данными
*/
function initData() {
  db.run(initPartyTable);
  db.run(initTypeEventTable);
  db.run(initPriceTable);
  db.run(initEventTable);
  db.run(initChangePriceTable);
  var addParticipant = function addParticipant(rec) {
    var obj = {};
    var makeProp = function makeProp(value, key) {
      return obj['$' + key] = value;
    };
    R.forEachObjIndexed(makeProp, rec);
    db.run(initParticipantTable, obj);
  };
  R.forEach(addParticipant, (0, _testdata.getParticipants)());
  var addParticipantEvent = function addParticipantEvent(rec) {
    var obj = {};
    var makeProp = function makeProp(value, key) {
      return obj['$' + key] = value;
    };
    R.forEachObjIndexed(makeProp, rec);
    db.run(initParticipantEventTable, obj);
  };
  R.forEach(addParticipantEvent, (0, _testdata.getParticipantEvents)());
}

/*
   Инициализируем всю базу данных
*/
function initDatabase() {
  db.serialize(function () {
    createDatabase();
    initData();
  });
}
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
  db.each("SELECT pkID, name, description, fkTypeEvent, fkParty, dtStart \n        FROM event_party", function (err, row) {
    console.log("pkID=".concat(row.pkID, " name=").concat(row.name, " descr=").concat(row.description, "\n    dtStart=").concat(_partyday.PartyDate.fromTS(row.dtStart), " fkTypeEvent=").concat(row.fkTypeEvent == undefined ? '' : row.fkTypeEvent));
  });
  db.each("SELECT event_party.pkID as pkID, event_party.name as name, \n         event_party.description, type_event.name as type, fkParty, dtStart \n        FROM event_party \n        join type_event \n        on type_event.pkID = event_party.fkTypeEvent", function (err, row) {
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
    var eventIdsFilter = '';
    var filterSearchStr = '';
    if (R.isNotNil(filter.ids) && !R.isEmpty(filter.ids)) {
      if (R.length(filter.ids) === 1) {
        eventIdsFilter = "and event_party.pkID = ".concat(filter.ids[0]);
      } else {
        eventIdsFilter = "and event_party.pkID in ( ".concat(filter.ids.join(','), " )");
      }
    }
    var excludeStr = '';
    if (R.isNotNil(filter.exclude)) {
      excludeStr = "and pkID not in ( select fkEvent \n                           from participant_event \n                           where fkParty = ".concat(filter.pid, " and\n                                 fkParticipant = ").concat(filter.exclude, " )");
    }
    if (R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr)) filterSearchStr = "and event_party.name like '%".concat(filter.searchStr, "%'");
    return "select event_party.pkID as pkID, \n                    event_party.name as name, \n                    event_party.description as description, \n                    type_event.name as evTypeName, \n                    event_party.dtStart  as dtStart,\n                    event_party.fkTypeEvent as fkTypeEvent,\n                    event_party.fkParty as fkParty,\n                    event_party.price as price\n                from event_party \n                     join type_event \n                     on type_event.pkID = event_party.fkTypeEvent\n                where fkParty = ".concat(filter.pid, " ").concat(eventIdsFilter, " ").concat(filterSearchStr, " ").concat(excludeStr);
  }

  /**
   * 
   * @param {*} ext 
   * @param {*} filter  - задает фильтрацию  списка 
   *                        { pid:<pkParty>, // идентификатор междусобойчика
   *                          exclude:<fkParticipant>, // исключить события которые указанный участник уже выбирал, необязательное
   *                          searchStr:<подстрока поиска по имени> }
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
      respHdl(err, rs);
    };
    var query = "select event_party.pkID as pkID, \n                           event_party.name as name, \n                           event_party.description as description, \n                           type_event.name as evTypeName, \n                           event_party.dtStart  as dtStart,\n                           event_party.fkParty as fkParty,\n                           event_party.price as price\n                    from event_party \n                        left join type_event \n                        on type_event.pkID = event_party.fkTypeEvent\n                    where\n                        event_party.pkID =".concat(filter.pkID, " and event_party.fkParty =").concat(filter.fkParty);
    db.get(query, getRow);
  }
  /*
  rec
  {
      ids: [ <список id на удаление> ]
      pid: <идентификатор междусобойчика>
  }
  * @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
  */
  function remove(_ref, respHdl) {
    var fkParty = _ref.fkParty,
      ids = _ref.ids;
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    var query = "delete from event_party \n                    where\n                        event_party.pkID in ( ".concat(ids.join(','), ") \n                        and event_party.fkParty =").concat(fkParty);
    db.run(query, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    var header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return '$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "insert into event_party( ".concat(flds.join(','), " ) \n                   values ( ").concat(placeholders.join(','), ") ");
    function onSuccess(err) {
      respHdl(err, this.lastID);
    }
    db.run(query, arg, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет кол-во обновленных записей
  */
  function update(rec, respHdl) {
    if (R.isNil(rec.pkID)) {
      respHdl(new Error("Невозможно выполнить обновление записи, так как не задано поле 'pkID'!"));
      return;
    }
    var header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return fld + '=$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "update event_party \n                   set ".concat(placeholders.join(', '), " \n                   where pkID = ").concat(rec.pkID);
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    db.run(query, arg, onSuccess);
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update
  });
}
function makeTypeEventParty() {
  function all(rs, respHdl) {
    var getRow = function getRow(err, row) {
      return (0, _record.addRecord)(rs, row);
    };
    var query = "SELECT pkID, name, description FROM type_event";
    db.each(query, getRow, function (err) {
      return respHdl(err, rs);
    });
  }
  return Object.freeze({
    all: all
  });
}

/* 
Основные запросы по таблице party 
*/
function makeParty() {
  /**
   *  Конструирование строки запроса для получения списка междусобойчиков
   */
  function listQueryStr(filter, ord, nav) {
    var eventIdsFilter = '';
    var filterSearchStr = '';
    if (R.isNotNil(filter.ids) && !R.isEmpty(filter.ids)) {
      if (R.length(filter.ids) === 1) {
        eventIdsFilter = "where pkID = ".concat(filter.ids[0]);
      } else {
        eventIdsFilter = "where pkID in ( ".concat(filter.ids.join(','), " )");
      }
    } else if (R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr)) filterSearchStr = "where party.name like '%".concat(filter.searchStr, "%'");
    return "select party.pkID as pkID, \n                       party.name as name, \n                       party.description as description, \n                       party.dtStart  as dtStart,\n                       party.dtEnd  as dtEnd,\n                       party.place as place,\n                       party.outgoing as outgoing,\n                       party.payment as payment,\n                       party.profit as profit\n                from party \n                ".concat(eventIdsFilter, " ").concat(filterSearchStr);
  }

  /**
   * 
   * @param {*} ext 
   * @param {*} filter  - задает фильтрацию  списка 
   *                        { ids:[], // идентификаторы междусобойчика
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
      respHdl(err, rs);
    };
    var query = "select party.pkID as pkID, \n                        party.name as name, \n                        party.description as description, \n                        party.dtStart  as dtStart,\n                        party.dtEnd  as dtEnd,\n                        party.place as place,\n                        party.outgoing as outgoing,\n                        party.payment as payment,\n                        party.profit as profit\n                    from party \n                    where pkID =".concat(filter.pkID);
    db.get(query, getRow);
  }
  /*
  rec
  {
      ids: [ <список id на удаление> ]
      pid: <идентификатор междусобойчика>
  }
  * @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
  */
  function remove(_ref2, respHdl) {
    var ids = _ref2.ids;
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    var query = "delete from party \n                    where pkID in ( ".concat(ids.join(','), ")");
    db.run(query, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    var header = ['name', 'description', 'dtStart', 'dtEnd', 'place', 'outgoing', 'payment', 'profit'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return '$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "insert into party( ".concat(flds.join(','), " ) \n                   values ( ").concat(placeholders.join(','), ") ");
    function onSuccess(err) {
      respHdl(err, this.lastID);
    }
    db.run(query, arg, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет кол-во обновленных записей
  */
  function update(rec, respHdl) {
    if (R.isNil(rec.pkID)) {
      respHdl(new Error("Невозможно выполнить обновление записи, так как не задано поле 'pkID'!"));
      return;
    }
    var header = ['name', 'description', 'dtStart', 'dtEnd', 'place', 'outgoing', 'payment', 'profit'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return fld + '=$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "update party \n                   set ".concat(placeholders.join(', '), " \n                   where pkID = ").concat(rec.pkID);
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    db.run(query, arg, onSuccess);
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update
  });
}
function makeParticipant() {
  /**
   *  Конструирование строки запроса для получения списка участников
   * filter={ searchStr:"вася", fkParty:1, ids:[1,2,3]}
   */
  function listQueryStr(filter, ord, nav) {
    var ids = '';
    var searchStr = '';
    if (R.isNotNil(filter.ids) && !R.isEmpty(filter.ids)) {
      if (R.length(filter.ids) === 1) {
        ids = "and p.pkID = ".concat(filter.ids[0]);
      } else {
        ids = "and p.pkID in ( ".concat(filter.ids.join(','), " )");
      }
    }
    if (R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr)) searchStr = "and ( p.name like '%".concat(filter.searchStr, "%' or\n                           p.surname like '%").concat(filter.searchStr, "%' or\n                           p.patronymic like '%").concat(filter.searchStr, "%' or\n                           p.phone like '%").concat(filter.searchStr, "%' or\n                           p.email like '%").concat(filter.searchStr, "%' or \n                           p.club like '%").concat(filter.searchStr, "%' )");
    return "select p.pkID as pkID, \n                   p.fkParty as fkParty,\n                   p.num as num,\n                   p.name as name, \n                   p.surname as surname, \n                   p.patronymic as patronymic, \n                   p.club as club, \n                   p.email as email, \n                   p.dtReg  as dtReg,\n                   p.phone  as phone,\n                   p.role as role,\n                   p.price as price,\n                   p.paid as paid,\n                   p.comment as comment\n            from participant p\n            where p.fkParty=".concat(filter.fkParty, " ").concat(ids, " ").concat(searchStr);
  }

  /**
  * 
  * @param {*} ext 
  * @param {*} filter  - задает фильтрацию  списка 
  *                        { ids:[], // идентификаторы участников
  *                          fkParty: 1, // идентифкатор междусобойчика
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
      if (err || R.isNil(row)) {
        respHdl(new _errors.RecordDoesNotExistErr("Participant", filter.pkID), null);
      } else {
        (0, _record.addRecord)(rs, row);
        respHdl(err, rs);
      }
    };
    var query = "select p.pkID as pkID, \n    p.fkParty as fkParty,\n    p.num as num,\n    p.name as name, \n    p.surname as surname, \n    p.patronymic as patronymic, \n    p.club as club, \n    p.email as email, \n    p.dtReg  as dtReg,\n    p.phone  as phone,\n    p.role as role,\n    p.price as price,\n    p.paid as paid,\n    p.comment as comment\n    from participant p\n    where p.pkID = ".concat(filter.pkID, " and p.fkParty=").concat(filter.fkParty);
    db.get(query, getRow);
  }

  /* удалить участников
  rec
  {
  ids: [ <список id на удаление> ]
  fkParty: <идентификатор междусобойчика>
  }
  * @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
  */
  function remove(_ref3, respHdl) {
    var ids = _ref3.ids,
      fkParty = _ref3.fkParty;
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    var query = "delete from participant\n                    where pkID in ( ".concat(ids.join(','), ") and fkParty = ").concat(fkParty);
    db.run(query, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    var header = ['fkParty', 'num', 'name', 'surname', 'patronymic', 'club', 'email', 'phone', 'dtReg', 'role', 'price', 'paid', 'comment'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return '$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "insert into participant( ".concat(flds.join(','), " ) \n                values ( ").concat(placeholders.join(','), ") ");
    function onSuccess(err) {
      respHdl(err, this.lastID);
    }
    db.run(query, arg, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет кол-во обновленных записей
  */
  function update(rec, respHdl) {
    var header = ['num', 'name', 'surname', 'patronymic', 'club', 'email', 'phone', 'dtReg', 'role', 'price', 'paid', 'comment'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return fld + '=$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "update participant\n                set ".concat(placeholders.join(', '), " \n                where pkID = ").concat(rec.pkID, " and fkParty = ").concat(rec.fkParty);
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    db.run(query, arg, onSuccess);
  }

  /* Получить следующий свободный номер для участника междусобойчика, наивная реализация, но отработает в 99%
  */
  function getNextNum(fkParty, respHdl) {
    var getRow = function getRow(err, row) {
      if (err) {
        respHdl(err, null);
      } else {
        respHdl(err, R.isNotNil(row) ? row.num : 1);
      }
    };
    var query = "select max(num) + 1 as num\n                    from participant\n                    where fkParty = ".concat(fkParty);
    db.get(query, getRow);
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update,
    getNextNum: getNextNum
  });
}
function makeParticipantEvent() {
  /**
   *  Конструирование строки запроса для получения списка событий в которых зарегистрировался участник
   * filter={ fkParty:1, fkParticipant:1, ids:[1,2,3] }
   */
  function listQueryStr(filter, ord, nav) {
    var ids = '';
    if (R.isNotNil(filter.ids) && !R.isEmpty(filter.ids)) {
      if (R.length(filter.ids) === 1) {
        ids = "and pe.pkID = ".concat(filter.ids[0]);
      } else {
        ids = "and pe.pkID in ( ".concat(filter.ids.join(','), " )");
      }
    }
    return "select pe.pkID as pkID, \n                   pe.fkParty as fkParty,\n                   pe.fkEvent as fkEvent,\n                   pe.fkParticipant as fkParticipant, \n                   pe.price as price, \n                   coalesce( pe.role, pt.role) as role, \n                   pe.comment as comment,\n                   ep.name as nameEvent\n            from \n                participant_event pe\n                join event_party ep\n                on pe.fkEvent = ep.pkID\n                join participant pt\n                on pe.fkParticipant = pt.pkID and pt.fkParty = pe.fkParty\n            where pe.fkParty=".concat(filter.fkParty, " and pe.fkParticipant=").concat(filter.fkParticipant, " ").concat(ids);
  }

  /**
  * 
  * @param {*} ext 
  * @param {*} filter  - задает фильтрацию  списка 
  *                        { ids:[], // идентификаторы событий участника
  *                          fkParty: 1, // идентификатор междусобойчика
  *                          fkParticipant } // идентификатор участника
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
      if (err || R.isNil(row)) {
        respHdl(new _errors.RecordDoesNotExistErr("ParticipantEvent", filter.pkID), null);
      } else {
        (0, _record.addRecord)(rs, row);
        respHdl(err, rs);
      }
    };
    var query = "select pe.pkID as pkID, \n            pe.fkParty as fkParty,\n            pe.fkEvent as fkEvent,\n            pe.fkParticipant as fkParticipant, \n            pe.price as price, \n            pe.role as role,\n            pe.comment as comment\n    from \n        participant_event pe\n    where \n        pe.fkParty=".concat(filter.fkParty, " and pe.pkID=").concat(filter.pkID);
    db.get(query, getRow);
  }

  /* удалить связи
  rec
  {
  ids: [ <список id на удаление> ]
  fkParty: <идентификатор междусобойчика>
  }
  * @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
  */
  function remove(_ref4, respHdl) {
    var ids = _ref4.ids,
      fkParty = _ref4.fkParty;
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    var query = "delete from participant_event\n                    where pkID in ( ".concat(ids.join(','), ") and fkParty = ").concat(fkParty);
    db.run(query, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    var header = ['fkParty', 'fkParticipant', 'fkEvent', 'price', 'role', 'comment'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return '$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "insert into participant_event( ".concat(flds.join(','), " ) \n                values ( ").concat(placeholders.join(','), ") ");
    function onSuccess(err) {
      respHdl(err, this.lastID);
    }
    db.run(query, arg, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет кол-во обновленных записей
  */
  function update(rec, respHdl) {
    var header = ['fkParticipant', 'fkEvent', 'price', 'role', 'comment'];
    var flds = R.filter(function (fld) {
      return fld in rec;
    }, header);
    var placeholders = R.map(function (fld) {
      return fld + '=$' + fld;
    }, flds);
    var arg = {};
    R.forEach(function (fld) {
      return arg['$' + fld] = rec[fld];
    }, flds);
    var query = "update participant_event\n               set ".concat(placeholders.join(', '), " \n               where pkID = ").concat(rec.pkID, " and fkParty = ").concat(rec.fkParty);
    function onSuccess(err) {
      respHdl(err, this.changes);
    }
    db.run(query, arg, onSuccess);
  }

  /**
   * Добавить события в которых хочет участвовать участник, если событие уже было добавлено ранее
   * то его добавление будет пропущено
   * @param {*} rec объект формата { ids, fkParty, fkParticipant }
   * ids - список идентифкаторов событий которые надо связать с участником fkParticipant
   * ids и fkParticipant должны принадлежать междусобойчику fkParty
   * @param {*} callback respHdl( err, true ) - если вставка прошла
   */
  function insertSelected(_ref5, respHdl) {
    var ids = _ref5.ids,
      fkParty = _ref5.fkParty,
      fkParticipant = _ref5.fkParticipant;
    var startStr = 'with T(fkParty, fkParticipant, fkEvent, price ) as ( values ';
    var endStr = ")  insert into participant_event( fkParty, fkParticipant, fkEvent, price )\n                    select \n                        T.fkParty, T.fkParticipant, T.fkEvent, event_party.price\n                    from T \n                    join event_party \n                    on event_party.pkID = T.fkEvent\n                    where T.fkEvent not in ( select fkEvent \n                                             from participant_event \n                                             where fkParty=".concat(fkParty, " and fkParticipant=").concat(fkParticipant, ")");
    var createQuery = function createQuery(q, id) {
      var comma = R.last(q) === ')' ? ',' : '';
      return q + comma + "( ".concat(fkParty, ", ").concat(fkParticipant, ", ").concat(id, ",  0 )");
    };
    var query = R.reduce(createQuery, startStr, ids) + endStr;
    function onSuccess(err) {
      respHdl(err, err ? null : true);
    }
    db.run(query, [], onSuccess);
  }
  return Object.freeze({
    list: list,
    read: read,
    remove: remove,
    insert: insert,
    update: update,
    insertSelected: insertSelected
  });
}
initDatabase();
var DBParty = makeParty();
exports.DBParty = DBParty;
var DBEventParty = makeEventParty();
exports.DBEventParty = DBEventParty;
var DBTypeEventParty = makeTypeEventParty();
exports.DBTypeEventParty = DBTypeEventParty;
var DBParticipant = makeParticipant();
exports.DBParticipant = DBParticipant;
var DBParticipantEvent = makeParticipantEvent();
exports.DBParticipantEvent = DBParticipantEvent;
var DBTest = makeTestDB();
exports.DBTest = DBTest;