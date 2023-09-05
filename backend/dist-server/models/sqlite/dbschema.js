"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DBTypeEventParty = exports.DBParty = exports.DBParticipant = exports.DBEventParty = void 0;
exports.doTestSQL = doTestSQL;
var R = _interopRequireWildcard(require("ramda"));
var _partyday = require("../../lib/partyday");
var _record = require("../../lib/record");
var _files = require("@babel/core/lib/config/files");
var _testdata = require("../tests/testdata");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
Создание схемы базы "Междусобойчика" в sqlite
*/

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var createParty = "create table party(\npkID integer primary key,\nfkClient int,\ndtStart int,\ndtEnd int,\nname text,\ndescription text,\nplace text,\noutgoing float,\npayment float,\nprofit float\n)";
var createEvent = "create table event_party(\npkID integer primary key,\nfkTypeEvent int,\nfkParty int not null,\ndtStart int,\nfree int,\nname text,\ndescription text)";
var createTypeEvent = "create table type_event(\npkID integer primary key,\nid text,\nname text,\ndescription text)";
var createPricesEvent = "create table price_event(\npkID integer primary key,\nname text,\nprice real)";
var createParticipant = "create table participant(\npkID integer primary key,\nname text,\nfkParty int not null,\nnum int,\nsurname text,\npatronymic text,\nphone text,\nemail text,\ndtReg int,\nclub text,\nrole text,\nprice real,\npaid real,\ncomment text )";
var initParticipantTable = "insert into participant( name, fkParty, num, surname, patronymic, phone, email, dtReg, club, role, price, paid, comment)\nvalues ( $name, $fkParty, $num, $surname, $patronymic, $phone, $email, $dtReg, $club, $role, $price, $paid, $comment)";

/* Генерируем данные
*/
var initPartyTable = "insert into party( name, place, dtStart, dtEnd, outgoing, payment, profit, fkClient ) \nvalues ( '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430', '\u042F\u0440\u043E\u0441\u043B\u0430\u0432\u043B\u044C',  \n         ".concat(_partyday.PartyDate.dateToTS('13.06.23'), ", \n         ").concat(_partyday.PartyDate.dateToTS('16.06.23'), ",0,0,0,1 ),\n       ( 'Swingtown Little Cup 2023', '\u041C\u043E\u0441\u043A\u0432\u0430', \n         ").concat(_partyday.PartyDate.dateToTS('20.06.23'), ", \n         ").concat(_partyday.PartyDate.dateToTS('26.06.23'), ", 0,0,0,1 )");
var initTypeEventTable = "insert into type_event( id, name ) \nvalues ( 'party', '\u0412\u0435\u0447\u0435\u0440\u0438\u043D\u043A\u0430' ),\n       ( 'lesson', '\u041B\u0435\u043A\u0446\u0438\u044F' ),\n       ( 'competition', 'C\u043E\u0440\u0435\u0432\u043D\u043E\u0432\u0430\u043D\u0438\u0435'),\n       ( 'masterClass', '\u041C\u0430\u0441\u0442\u0435\u0440-\u043A\u043B\u0430\u0441\u0441')";
var initPricesTable = "insert into price_event( 'name', 'price' ) \nvalues ( '\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0434\u043E 12.02.23', 20000 ),\n       ( \"\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u043F\u043E\u0441\u043B\u0435 12.02.23\", 23000 )";
var initEventTable = "insert into event_party( 'name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty' ) \n        values ( 'Mix&Match Kids', '\u0422\u0435\u043C\u043F 32-38 bpm', \n                 ".concat(_partyday.PartyDate.toTS('13.06.23 11:00:00'), ", \n                 (select pkID from type_event where id = 'competition'), \n                 (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' )),\n               ( 'Strictly Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.23 13:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = '\u0418\u0441\u043A\u0440\u044B \u0434\u0436\u0430\u0437\u0430' )),\n                ( 'Strictly Kids', '\u0422\u0435\u043C\u043F 40-42 bpm', \n                ").concat(_partyday.PartyDate.toTS('13.06.22 15:00:00'), ", \n                (select pkID from type_event where id = 'competition'),\n                (select pkID from party where name = 'Swingtown Little Cup 2023' ))");

/*
Создаем таблицы
*/
function initDatabase() {
  db.serialize(function () {
    db.run(createParty);
    db.run(createEvent);
    db.run(createTypeEvent);
    db.run(createPricesEvent);
    db.run(createParticipant);
    db.run(initPartyTable);
    db.run(initTypeEventTable);
    db.run(initPricesTable);
    db.run(initEventTable);
    var addParticipant = function addParticipant(rec) {
      var obj = {};
      var makeProp = function makeProp(value, key) {
        return obj['$' + key] = value;
      };
      R.forEachObjIndexed(makeProp, rec);
      db.run(initParticipantTable, obj);
    };
    R.forEach(addParticipant, (0, _testdata.getParticipants)());
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
    if (R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr)) filterSearchStr = "and event_party.name like '%".concat(filter.searchStr, "%'");
    return "select event_party.pkID as pkID, \n                    event_party.name as name, \n                    event_party.description as description, \n                    type_event.name as evTypeName, \n                    event_party.dtStart  as dtStart,\n                    event_party.fkTypeEvent as fkTypeEvent,\n                    event_party.fkParty as fkParty\n                from event_party \n                     join type_event \n                     on type_event.pkID = event_party.fkTypeEvent\n                where fkParty = ".concat(filter.pid, " ").concat(eventIdsFilter, " ").concat(filterSearchStr);
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
    var query = "select event_party.pkID as pkID, \n                           event_party.name as name, \n                           event_party.description as description, \n                           type_event.name as evTypeName, \n                           event_party.dtStart  as dtStart,\n                           event_party.fkParty as fkParty\n                    from event_party \n                        left join type_event \n                        on type_event.pkID = event_party.fkTypeEvent\n                    where\n                        event_party.pkID =".concat(filter.pkID, " and event_party.fkParty =").concat(filter.fkParty);
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
    var header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty'];
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
    var header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty'];
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
    if (R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr)) filterSearchStr = "and p.name like '%".concat(filter.searchStr, "%'");
    return "select p.pkID as pkID, \n                   p.fkParty as fkParty,\n                   p.num as num,\n                   p.name as name, \n                   p.surname as surname, \n                   p.patronymic as patronymic, \n                   p.club as club, \n                   p.email as email, \n                   p.dtReg  as dtReg,\n                   p.phone  as phone\n                   p.role as role,\n                   p.price as price,\n                   p.paid as paid,\n                   p.comment as comment\n            from participant p\n            where fkParty=".concat(filter.fkParty, " ").concat(ids, " ").concat(searchStr);
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
      (0, _record.addRecord)(rs, row);
      respHdl(err, rs);
    };
    var query = "select p.pkID as pkID, \np.fkParty as fkParty,\np.num as num,\np.name as name, \np.surname as surname, \np.patronymic as patronymic, \np.club as club, \np.email as email, \np.dtReg  as dtReg,\np.phone  as phone\np.role as role,\np.price as price,\np.paid as paid,\np.comment as comment\nfrom participant p\nwhere fkParty=".concat(filter.fkParty);
    db.get(query, getRow);
  }

  /*
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
    var query = "delete from participant\n                where pkID in ( ".concat(ids.join(','), ") fkParty = ").concat(fkParty);
    db.run(query, onSuccess);
  }

  /*    
  * @param {*} rec запись
  * @param {*} respHdl (err, res) в res будет id добавленной записи
  */
  function insert(rec, respHdl) {
    if (R.isNil(rec.fkParty)) {
      respHdl(new Error("Невозможно выполнить обновление записи, так как не задано поле 'fkParty'!"));
      return;
    }
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
    var query = "insert into participant( ".concat(flds.join(','), " ) \n               values ( ").concat(placeholders.join(','), ") ");
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
    if (R.isNil(rec.fkParty)) {
      respHdl(new Error("Невозможно выполнить обновление записи, так как не задано поле 'fkParty'!"));
      return;
    }
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
    var query = "update participant\n               set ".concat(placeholders.join(', '), " \n               where pkID = ").concat(rec.pkID, " and fkParty = ").concat(rec.fkParty);
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
var DBParty = makeParty();
exports.DBParty = DBParty;
var DBEventParty = makeEventParty();
exports.DBEventParty = DBEventParty;
var DBTypeEventParty = makeTypeEventParty();
exports.DBTypeEventParty = DBTypeEventParty;
var DBParticipant = makeParticipant();
exports.DBParticipant = DBParticipant;