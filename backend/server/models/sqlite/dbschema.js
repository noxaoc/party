/*
Создание схемы базы "Междусобойчика" в sqlite
*/
import { where } from 'ramda';
import { PartyDate }  from '../../lib/partyday'
import { addRecord } from '../../lib/record'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const createParty =
`create table party(
pkID integer primary key,
dtStart int,
dtEnd int,
name text,
description text)`

const createEvent =
`create table event_party(
pkID integer primary key,
fkEventType int,
fkParty int,
dtStart int,
free int,
name text,
description text)`

const createTypeEvent =
`create table type_event(
pkID integer primary key,
id text,
name text,
description text)`

const createPricesEvent =
`create table price_event(
pkID integer primary key,
name text,
price real)`

/* Генерируем данные
*/
const initPartyTable = 
`insert into party( name ) 
values ( 'Искры джаза' ),
       ( 'Swingtown Little Cup 2023' )`
    
const initTypeEventTable = 
`insert into type_event( id, name ) 
values ( 'party', 'Вечеринка' ),
       ( 'lesson', 'Лекция' ),
       ( 'competition', 'Cоревнование'),
       ( 'masterClass', 'Мастер-класс')`

const initPricesTable =
`insert into price_event( 'name', 'price' ) 
values ( 'Базовая до 12.02.23', 20000 ),
       ( "Базовая после 12.02.23", 23000 )`

const initEventTable =
`insert into event_party( 'name', 'description', 'dtStart', 'fkEventType', 'fkParty' ) 
        values ( 'Mix&Match Kids', 'Темп 32-38 bpm', 
                 ${ PartyDate.toTS('13.06.23 11:00:00') }, 
                 (select pkID from type_event where id = 'competition'), 
                 (select pkID from party where name = 'Искры джаза' )),
               ( 'Strictly Kids', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.23 13:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Искры джаза' )),
                ( 'Strictly Kids', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.22 15:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Swingtown Little Cup 2023' ))`

/*
Создаем таблицы
*/
function initDatabase(){
db.serialize(() => {
    db.run(createParty)
    db.run(createEvent)
    db.run(createTypeEvent)
    db.run(createPricesEvent)

    db.run(initPartyTable)
    db.run(initTypeEventTable)
    db.run(initPricesTable)
    db.run(initEventTable)
})
}
initDatabase()

export function doTestSQL(){
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
db.each("SELECT pkID, name FROM party", (err, row) => {
    console.log(`pkID=${row.pkID} name=${row.name}`)
})

db.each("SELECT pkID, id, name FROM type_event where pkID=3", (err, row) => {
    console.log(`pkID=${row.pkID} name=${row.name} id=${row.id}`)
})

db.each("SELECT pkID, name, price FROM price_event ", (err, row) => {
        console.log(`pkID=${row.pkID} name=${row.name} price=${row.price}`)
})

db.each(`SELECT pkID, name, description, fkEventType, fkParty, dtStart 
        FROM event_party`, (err, row) => {
    console.log(`pkID=${row.pkID} name=${row.name} descr=${row.description}
    dtStart=${ PartyDate.fromTS(row.dtStart)} fkEventType=${row.fkEventType==undefined? '': row.fkEventType}` ) 
}) 


db.each(`SELECT event_party.pkID as pkID, event_party.name as name, 
         event_party.description, type_event.name as type, fkParty, dtStart 
        FROM event_party 
        join type_event 
        on type_event.pkID = event_party.fkEventType`, (err, row) => {
    console.log(err)
    console.log(`pkID=${row.pkID} name=${row.name} descr=${row.description}
    dtStart=${ PartyDate.fromTS(row.dtStart)} type=${row.type}` )
    
})
}

/* 
Основные запросы по таблице event_party 
*/
function makeEventParty(){
    /**
     *  Конструирование строки запроса для получения списка событий междусобойчика
     */
    function listQueryStr( filter, ord, nav ){
        return (
               `select event_party.pkID as id, 
                    event_party.name as name, 
                    event_party.description as description, 
                    type_event.name as evTypeName, 
                    event_party.dtStart  as dtStart
                from event_party 
                     join type_event 
                     on type_event.pkID = event_party.fkEventType
                where fkParty = ${filter.pid}` )
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
  function list(rs, filter, ord, nav, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = listQueryStr(filter,ord,nav)
    db.each(query, getRow, ( err )=>respHdl(err,rs) )  
}


function read( rs, filter, respHdl ){ 
    const getRow = (err, row )=>{
        addRecord(rs, row)
        respHdl(rs)
    }
    const query  = `select event_party.pkID as id, 
                           event_party.name as name, 
                           event_party.description as description, 
                           type_event.name as evTypeName, 
                           event_party.dtStart  as dtStart
                    from event_party 
                        left join type_event 
                        on type_event.pkID = event_party.fkEventType
                    where
                        event_party.pkID =${filter.id} and event_party.fkParty =${filter.pid}`
    db.get(query, getRow)
}
    function remove(){ console.log("call remove") }
    function insert() { console.log("call insrty") }
    function update(){console.log("call upadte") }
    
    return Object.freeze({
        list,
        read,
        remove,
        insert,
        update
    });
}
export const DBEventParty = makeEventParty()

export function Participant(){
  
        
    function list( ext, filter, ord,  nav ){ 

        console.log("call list"); 
    }
    function read() { console.log("call read"); }
    function remove(){ console.log("call remove");}
    function insert() { console.log("call insrty"); }
    function update(){console.log("call upadte");}
    
    return Object.freeze({
        list,
        read,
        remove,
        insert,
        update
    });
}



