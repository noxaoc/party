/*
Создание схемы базы "Междусобойчика" в sqlite
*/
import * as R from 'ramda';
import { PartyDate }  from '../../lib/partyday'
import { addRecord } from '../../lib/record'
//import { resolveShowConfigPath } from '@babel/core/lib/config/files';
import { getParticipants, getParticipantEvents } from '../tests/testdata';
import { RecordDoesNotExistErr } from '../lib/errors';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const createParty =
`create table party(
pkID integer primary key,
fkClient int,
dtStart int,
dtEnd int,
name text,
description text,
place text,
outgoing float,
payment float,
profit float
)`

const createEvent =
`create table event_party(
pkID integer primary key,
fkTypeEvent int,
fkParty int not null,
dtStart int,
free int,
name text,
price real,
description text,
foreign key ( fkParty ) references Party ( pkID ) )`

const createChangePrice =
`create table change_price(
pkID integer primary key,
fkParty int,
percent int,
date int, 
foreign key ( fkParty ) references Party ( pkID ))`

const createTypeEvent =
`create table type_event(
pkID integer primary key,
id text,
name text,
description text)`

const createPriceEvent =
`create table price_event(
pkID integer primary key,
fkParty int,
fkEvent int,
name text,
price real)`

const createParticipant =
`create table participant(
pkID integer primary key,
name text,
fkParty int not null,
num int,
surname text,
patronymic text,
phone text,
email text,
dtReg int,
club text,
role text,
price real,
paid real,
comment text,
unique ( fkParty, num ),
foreign key ( fkParty ) references Party ( pkID ) )`

const createParticipantEvent =
`create table participant_event(
pkID integer primary key,
fkEvent int,
fkParticipant int,
fkParty int,
price real,
role text,
comment text,
foreign key ( fkParty ) references party ( pkID ),
foreign key ( fkEvent, fkParty ) references event_party ( pkID, fkParty ),
foreign key ( fkParticipant, fkParty ) references participant ( pkID, fkParty ) )`


const initParticipantTable = 
`insert into participant( name, fkParty, num, surname, patronymic, phone, email, dtReg, club, role, price, paid, comment)
values ( $name, $fkParty, $num, $surname, $patronymic, $phone, $email, $dtReg, $club, $role, $price, $paid, $comment)`

/* Генерируем данные
*/
const initPartyTable = 
`insert into party( name, place, dtStart, dtEnd, outgoing, payment, profit, fkClient ) 
values ( 'Swingtown Little Cup 2023', 'Москва', 
         ${ PartyDate.dateToTS('20.06.23') }, 
         ${ PartyDate.dateToTS('26.06.23') }, 0,0,0,1 ),
        ( 'Искры джаза', 'Ярославль',  
         ${ PartyDate.dateToTS('13.06.23') }, 
         ${ PartyDate.dateToTS('16.06.23') },0,0,0,1 )`
    
const initTypeEventTable = 
`insert into type_event( id, name ) 
values ( 'party', 'Вечеринка' ),
       ( 'lesson', 'Лекция' ),
       ( 'competition', 'Cоревнование'),
       ( 'masterClass', 'Мастер-класс')`

const initPriceTable =
`insert into price_event( 'name', 'price' ) 
values ( 'Базовая до 12.02.23', 20000 ),
       ( "Базовая после 12.02.23", 23000 )`

const initChangePriceTable =
`insert into change_price( 'date', 'percent', 'fkParty' ) 
values ( ${ PartyDate.toTS('13.06.23 11:00:00')}, 10, (select pkID from party where name = 'Swingtown Little Cup 2023' ) ),
       ( ${ PartyDate.toTS('13.06.23 11:00:00')}, 15, (select pkID from party where name = 'Swingtown Little Cup 2023' ) )`

const initEventTable =
`insert into event_party( 'name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price' ) 
        values ( 'Mix&Match Kinders', 'Темп 32-38 bpm', 
                 ${ PartyDate.toTS('13.06.23 11:00:00')}, 
                 (select pkID from type_event where id = 'competition'), 
                 (select pkID from party where name = 'Искры джаза' ), 1000),
               ( 'Strictly Kinders', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.23 13:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Искры джаза' ), 1000),
                ( 'Strictly Kids', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.22 15:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1700),
                ( 'Big Little', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('14.06.22 16:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 2500),
                ( 'Mix&Match Kids', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.22 17:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1600),
                ( 'Mix&Match Junior', 'Темп 40-42 bpm', 
                ${ PartyDate.toTS('13.06.22 18:00:00') }, 
                (select pkID from type_event where id = 'competition'),
                (select pkID from party where name = 'Swingtown Little Cup 2023' ), 1300)`

const initParticipantEventTable =
`insert into participant_event( 'fkParticipant', 'fkEvent', 'comment', 'role', 'price', 'fkParty' ) 
        values ( (select pkID from participant where name = $name limit 1 ),
                 (select pkID from event_party where name = $eventName limit 1), 
                 $comment,
                 $role,
                 $price,
                 (select pkID from party where name = $partyName limit 1 ) )`

function delTables(){
    const tbls = [ 'participant_event', 'participant', 'price_event', 'type_event', 'event_party' ]
    const delTbl = name => db.run( `delete from ${name}` )
    R.forEach( delTbl, tbls )
}

function makeTestDB(){
    
    function reInitDatabase( done ){
        db.serialize(() => {
           delTables()
           initData()
           db.run( "select * from event_party limit 1", ( err, row )=> done() )
        })  
    }

    return Object.freeze({
        reInitDatabase
    });
}

/*
    Создаем таблицы
*/
function createDatabase(){
    const stmts = [ createParty, createEvent, createTypeEvent, createPriceEvent, createParticipant, 
                    createParticipantEvent, createChangePrice ]
    const createTbl = stmt => db.run( stmt )
    R.forEach( createTbl, stmts )
}

/*
    Проинициализировать базу данными
*/
function  initData(){
    db.run(initPartyTable)
    db.run(initTypeEventTable)
    db.run(initPriceTable)
    db.run(initEventTable)
    db.run(initChangePriceTable)

    const addParticipant = rec => {
        let obj = {}
        const makeProp = (value, key) => obj['$' + key]=value
        R.forEachObjIndexed( makeProp, rec )
        db.run( initParticipantTable, obj )
    }
    R.forEach( addParticipant, getParticipants() )

    const addParticipantEvent = rec => {
        let obj = {}
        const makeProp = (value, key) => obj['$' + key]=value
        R.forEachObjIndexed( makeProp, rec )
        db.run( initParticipantEventTable, obj )
    }
    R.forEach( addParticipantEvent, getParticipantEvents() )
}

/*
   Инициализируем всю базу данных
*/
function initDatabase(){
    db.serialize(() => {
        createDatabase()
        initData()
    })
}

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

db.each(`SELECT pkID, name, description, fkTypeEvent, fkParty, dtStart 
        FROM event_party`, (err, row) => {
    console.log(`pkID=${row.pkID} name=${row.name} descr=${row.description}
    dtStart=${ PartyDate.fromTS(row.dtStart)} fkTypeEvent=${row.fkTypeEvent==undefined? '': row.fkTypeEvent}` ) 
}) 


db.each(`SELECT event_party.pkID as pkID, event_party.name as name, 
         event_party.description, type_event.name as type, fkParty, dtStart 
        FROM event_party 
        join type_event 
        on type_event.pkID = event_party.fkTypeEvent`, (err, row) => {
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
        let eventIdsFilter = '' 
        let filterSearchStr = ''
        if( R.isNotNil(filter.ids) && !R.isEmpty(filter.ids) ){   
            if( R.length(filter.ids) === 1 ){
                eventIdsFilter = `and event_party.pkID = ${filter.ids[0]}`
            }else{
                eventIdsFilter = `and event_party.pkID in ( ${filter.ids.join(',')} )`
            }
        }
        let excludeStr = ''
        if( R.isNotNil(filter.exclude) ){
            excludeStr =   `and pkID not in ( select fkEvent 
                           from participant_event 
                           where fkParty = ${filter.pid} and
                                 fkParticipant = ${filter.exclude} )`
        }
        if( R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr) )       
            filterSearchStr = `and event_party.name like '%${filter.searchStr}%'`
        
        return (
               `select event_party.pkID as pkID, 
                    event_party.name as name, 
                    event_party.description as description, 
                    type_event.name as evTypeName, 
                    event_party.dtStart  as dtStart,
                    event_party.fkTypeEvent as fkTypeEvent,
                    event_party.fkParty as fkParty,
                    event_party.price as price
                from event_party 
                     join type_event 
                     on type_event.pkID = event_party.fkTypeEvent
                where fkParty = ${filter.pid} ${eventIdsFilter} ${filterSearchStr} ${excludeStr}` )
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
  function list(rs, filter, ord, nav, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = listQueryStr(filter,ord,nav)
    db.each(query, getRow, ( err )=>respHdl(err,rs) )  
}

function read( rs, filter, respHdl ){ 
    const getRow = ( err, row )=>{
        addRecord(rs, row)
        respHdl(err,rs)
    }
    const query  = `select event_party.pkID as pkID, 
                           event_party.name as name, 
                           event_party.description as description, 
                           type_event.name as evTypeName, 
                           event_party.dtStart  as dtStart,
                           event_party.fkParty as fkParty,
                           event_party.price as price
                    from event_party 
                        left join type_event 
                        on type_event.pkID = event_party.fkTypeEvent
                    where
                        event_party.pkID =${filter.pkID} and event_party.fkParty =${filter.fkParty}`
    db.get(query, getRow)
}
/*
rec
{
    ids: [ <список id на удаление> ]
    pid: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( {fkParty, ids}, respHdl ){
    function onSuccess(err){
        respHdl( err, this.changes  )
    }
    const query  = `delete from event_party 
                    where
                        event_party.pkID in ( ${ids.join(',')}) 
                        and event_party.fkParty =${fkParty}`
    db.run(query, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    const header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price']
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>'$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `insert into event_party( ${flds.join(',')} ) 
                   values ( ${placeholders.join(',')}) ` 
    
    function onSuccess (err){
        respHdl(err, this.lastID)
    }
    db.run( query, arg, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей
*/
function update(rec,respHdl){
    if( R.isNil(rec.pkID) ){
        respHdl( new Error("Невозможно выполнить обновление записи, так как не задано поле 'pkID'!"))
        return
    }
    const header = ['name', 'description', 'dtStart', 'fkTypeEvent', 'fkParty', 'price']
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>fld+'=$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `update event_party 
                   set ${placeholders.join(', ')} 
                   where pkID = ${rec.pkID}`
    function onSuccess (err){
        respHdl(err, this.changes)
    }
    db.run( query, arg, onSuccess )

}
    
    return Object.freeze({
        list,
        read,
        remove,
        insert,
        update
    });
}

function makeTypeEventParty(){
  
function all( rs, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = "SELECT pkID, name, description FROM type_event"
    db.each(query, getRow, ( err )=>respHdl(err,rs) ) 
}

return Object.freeze({
    all
})
}

/* 
Основные запросы по таблице party 
*/
function makeParty(){
    /**
     *  Конструирование строки запроса для получения списка междусобойчиков
     */
    function listQueryStr( filter, ord, nav ){
        let eventIdsFilter = '' 
        let filterSearchStr = ''
        if( R.isNotNil(filter.ids) && !R.isEmpty(filter.ids) ){   
            if( R.length(filter.ids) === 1 ){
                eventIdsFilter = `where pkID = ${filter.ids[0]}`
            }else{
                eventIdsFilter = `where pkID in ( ${filter.ids.join(',')} )`
            }
        }
        else if( R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr) )       
            filterSearchStr = `where party.name like '%${filter.searchStr}%'`
        
        return (
               `select party.pkID as pkID, 
                       party.name as name, 
                       party.description as description, 
                       party.dtStart  as dtStart,
                       party.dtEnd  as dtEnd,
                       party.place as place,
                       party.outgoing as outgoing,
                       party.payment as payment,
                       party.profit as profit
                from party 
                ${eventIdsFilter} ${filterSearchStr}` )
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
  function list(rs, filter, ord, nav, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = listQueryStr(filter,ord,nav)
    db.each(query, getRow,  err=>respHdl(err,rs) )  
}

function read( rs, filter, respHdl ){ 
    const getRow = (err, row )=>{
        addRecord(rs, row)
        respHdl(err,rs)
    }
    const query  = `select party.pkID as pkID, 
                        party.name as name, 
                        party.description as description, 
                        party.dtStart  as dtStart,
                        party.dtEnd  as dtEnd,
                        party.place as place,
                        party.outgoing as outgoing,
                        party.payment as payment,
                        party.profit as profit
                    from party 
                    where pkID =${filter.pkID}`
    db.get(query, getRow )
}
/*
rec
{
    ids: [ <список id на удаление> ]
    pid: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( {ids}, respHdl ){
    function onSuccess(err){
        respHdl( err, this.changes  )
    }
    const query  = `delete from party 
                    where pkID in ( ${ids.join(',')})`
    db.run(query, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    const header = ['name', 'description', 'dtStart', 'dtEnd', 'place', 'outgoing', 'payment', 'profit']
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>'$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `insert into party( ${flds.join(',')} ) 
                   values ( ${placeholders.join(',')}) ` 
    
    function onSuccess (err){
        respHdl(err, this.lastID)
    }
    db.run( query, arg, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей
*/
function update(rec,respHdl){
    if( R.isNil(rec.pkID) ){
        respHdl( new Error("Невозможно выполнить обновление записи, так как не задано поле 'pkID'!"))
        return
    }
    const header = ['name', 'description', 'dtStart', 'dtEnd', 'place', 'outgoing', 'payment', 'profit']
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>fld+'=$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `update party 
                   set ${placeholders.join(', ')} 
                   where pkID = ${rec.pkID}`
    function onSuccess (err){
        respHdl(err, this.changes)
    }
    db.run( query, arg, onSuccess )
}
    
return Object.freeze({
    list,
    read,
    remove,
    insert,
    update
})

}

function makeParticipant(){
        
/**
 *  Конструирование строки запроса для получения списка участников
 * filter={ searchStr:"вася", fkParty:1, ids:[1,2,3]}
 */
  function listQueryStr( filter, ord, nav ){
    let ids = '' 
    let searchStr = ''
    if( R.isNotNil(filter.ids) && !R.isEmpty(filter.ids) ){   
        if( R.length(filter.ids) === 1 ){
            ids = `and p.pkID = ${filter.ids[0]}`
        }else{
            ids = `and p.pkID in ( ${filter.ids.join(',')} )`
        }
    }
    if( R.isNotNil(filter.searchStr) && !R.isEmpty(filter.searchStr) )       
        searchStr = `and ( p.name like '%${filter.searchStr}%' or
                           p.surname like '%${filter.searchStr}%' or
                           p.patronymic like '%${filter.searchStr}%' or
                           p.phone like '%${filter.searchStr}%' or
                           p.email like '%${filter.searchStr}%' or 
                           p.club like '%${filter.searchStr}%' )`
    
    return (
           `select p.pkID as pkID, 
                   p.fkParty as fkParty,
                   p.num as num,
                   p.name as name, 
                   p.surname as surname, 
                   p.patronymic as patronymic, 
                   p.club as club, 
                   p.email as email, 
                   p.dtReg  as dtReg,
                   p.phone  as phone,
                   p.role as role,
                   p.price as price,
                   p.paid as paid,
                   p.comment as comment
            from participant p
            where p.fkParty=${filter.fkParty} ${ids} ${searchStr}` )
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
function list(rs, filter, ord, nav, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = listQueryStr(filter,ord,nav)
    db.each(query, getRow,  err=>respHdl(err,rs) )  
}

function read( rs, filter, respHdl ){ 
    const getRow = (err, row )=>{
        if( err || R.isNil(row)) {
            respHdl( new RecordDoesNotExistErr("Participant", filter.pkID),null)
        } else { 
            addRecord(rs, row)
            respHdl(err,rs)
        }
    }
    const query  = 
    `select p.pkID as pkID, 
    p.fkParty as fkParty,
    p.num as num,
    p.name as name, 
    p.surname as surname, 
    p.patronymic as patronymic, 
    p.club as club, 
    p.email as email, 
    p.dtReg  as dtReg,
    p.phone  as phone,
    p.role as role,
    p.price as price,
    p.paid as paid,
    p.comment as comment
    from participant p
    where p.pkID = ${filter.pkID} and p.fkParty=${filter.fkParty}`
                
    db.get(query, getRow )
}

/* удалить участников
rec
{
ids: [ <список id на удаление> ]
fkParty: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( {ids, fkParty}, respHdl ){
    function onSuccess(err){
        respHdl( err, this.changes  )
    }
    const query  = `delete from participant
                    where pkID in ( ${ids.join(',')}) and fkParty = ${fkParty}` 
    db.run(query, onSuccess )
}



/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    const header = ['fkParty','num','name', 'surname','patronymic','club','email','phone','dtReg','role','price','paid','comment'] 
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>'$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `insert into participant( ${flds.join(',')} ) 
                values ( ${placeholders.join(',')}) ` 

    function onSuccess (err){
        respHdl(err, this.lastID)
    }
    db.run( query, arg, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей
*/
function update(rec,respHdl){
    const header = ['num','name', 'surname','patronymic','club','email','phone','dtReg','role','price','paid','comment'] 

    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>fld+'=$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `update participant
                set ${placeholders.join(', ')} 
                where pkID = ${rec.pkID} and fkParty = ${rec.fkParty}`
    function onSuccess (err){
        respHdl(err, this.changes)
    }
    db.run( query, arg, onSuccess )
}

/* Получить следующий свободный номер для участника междусобойчика, наивная реализация, но отработает в 99%
*/
function getNextNum( fkParty, respHdl ){
    const getRow = (err, row )=>{
        if( err ) {
            respHdl( err, null )
        } else { 
            respHdl( err, R.isNotNil(row) ? row.num : 1 )
        }
    }
    const query  = `select max(num) + 1 as num
                    from participant
                    where fkParty = ${fkParty}` 
    db.get(query, getRow )
}
    
    return Object.freeze({
        list,
        read,
        remove,
        insert,
        update,
        getNextNum
    });
}

function makeParticipantEvent(){
        
    /**
     *  Конструирование строки запроса для получения списка событий в которых зарегистрировался участник
     * filter={ fkParty:1, fkParticipant:1, ids:[1,2,3] }
     */
  function listQueryStr( filter, ord, nav ){
    let ids = '' 
    if( R.isNotNil(filter.ids) && !R.isEmpty(filter.ids) ){   
        if( R.length(filter.ids) === 1 ){
            ids = `and pe.pkID = ${filter.ids[0]}`
        }else{
            ids = `and pe.pkID in ( ${filter.ids.join(',')} )`
        }
    }
    
    return (
           `select pe.pkID as pkID, 
                   pe.fkParty as fkParty,
                   pe.fkEvent as fkEvent,
                   pe.fkParticipant as fkParticipant, 
                   pe.price as price, 
                   coalesce( pe.role, pt.role) as role, 
                   pe.comment as comment,
                   ep.name as nameEvent
            from 
                participant_event pe
                join event_party ep
                on pe.fkEvent = ep.pkID
                join participant pt
                on pe.fkParticipant = pt.pkID and pt.fkParty = pe.fkParty
            where pe.fkParty=${filter.fkParty} and pe.fkParticipant=${filter.fkParticipant} ${ids}` )
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
function list(rs, filter, ord, nav, respHdl ){ 
    const getRow = (err, row )=>addRecord(rs, row)
    const query  = listQueryStr(filter,ord,nav)
    db.each(query, getRow,  err=>respHdl(err,rs) )  
}

function read( rs, filter, respHdl ){ 
    const getRow = (err, row )=>{
        if( err || R.isNil(row)) {
            respHdl( new RecordDoesNotExistErr("ParticipantEvent", filter.pkID),null)
        } else { 
            addRecord(rs, row)
            respHdl(err,rs)
        }
    }
    const query  = 
    `select pe.pkID as pkID, 
            pe.fkParty as fkParty,
            pe.fkEvent as fkEvent,
            pe.fkParticipant as fkParticipant, 
            pe.price as price, 
            pe.role as role,
            pe.comment as comment
    from 
        participant_event pe
    where 
        pe.fkParty=${filter.fkParty} and pe.pkID=${filter.pkID}`                
    db.get(query, getRow )
}

/* удалить связи
rec
{
ids: [ <список id на удаление> ]
fkParty: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( {ids, fkParty}, respHdl ){
    function onSuccess(err){
        respHdl( err, this.changes  )
    }
    const query  = `delete from participant_event
                    where pkID in ( ${ids.join(',')}) and fkParty = ${fkParty}` 
    db.run(query, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    const header = ['fkParty', 'fkParticipant', 'fkEvent', 'price', 'role', 'comment'] 
    const flds =  R.filter( fld => fld in rec, header )
    const placeholders = R.map( fld=>'$'+fld, flds )
    const arg = {}
    R.forEach( fld => arg['$'+fld]=rec[fld], flds )

    const query = `insert into participant_event( ${flds.join(',')} ) 
                values ( ${placeholders.join(',')}) ` 

    function onSuccess (err){
        respHdl(err, this.lastID)
    }
    db.run( query, arg, onSuccess )
}

/*    
* @param {*} rec запись
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей
*/
function update(rec,respHdl){
const header = ['fkParticipant', 'fkEvent', 'price', 'role', 'comment'] 

const flds =  R.filter( fld => fld in rec, header )
const placeholders = R.map( fld=>fld+'=$'+fld, flds )
const arg = {}
R.forEach( fld => arg['$'+fld]=rec[fld], flds )

const query = `update participant_event
               set ${placeholders.join(', ')} 
               where pkID = ${rec.pkID} and fkParty = ${rec.fkParty}`
function onSuccess (err){
    respHdl(err, this.changes)
}
db.run( query, arg, onSuccess )
}

/**
 * Добавить события в которых хочет участвовать участник, если событие уже было добавлено ранее
 * то его добавление будет пропущено
 * @param {*} rec объект формата { ids, fkParty, fkParticipant }
 * ids - список идентифкаторов событий которые надо связать с участником fkParticipant
 * ids и fkParticipant должны принадлежать междусобойчику fkParty
 * @param {*} callback respHdl( err, true ) - если вставка прошла
 */
function insertSelected( { ids, fkParty, fkParticipant }, respHdl ){
    const startStr = 'with T(fkParty, fkParticipant, fkEvent, price ) as ( values '
    const endStr = `)  insert into participant_event( fkParty, fkParticipant, fkEvent, price )
                    select 
                        T.fkParty, T.fkParticipant, T.fkEvent, event_party.price
                    from T 
                    join event_party 
                    on event_party.pkID = T.fkEvent
                    where T.fkEvent not in ( select fkEvent 
                                             from participant_event 
                                             where fkParty=${fkParty} and fkParticipant=${fkParticipant})`
    
    const createQuery = ( q, id ) => {
        const comma = R.last(q) === ')' ? ',' : ''
        return q +  comma + `( ${fkParty}, ${fkParticipant}, ${id},  0 )`
    }
    const query = R.reduce( createQuery, startStr, ids ) + endStr
    function onSuccess (err){
        respHdl(err, err ? null : true  )
    }
    db.run( query, [], onSuccess )
}


    return Object.freeze({
        list,
        read,
        remove,
        insert,
        update,
        insertSelected
    });
}

initDatabase()
export const DBParty = makeParty()
export const DBEventParty = makeEventParty()
export const DBTypeEventParty = makeTypeEventParty()
export const DBParticipant = makeParticipant()
export const DBParticipantEvent = makeParticipantEvent()
export const DBTest = makeTestDB()
