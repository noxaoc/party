import * as R from 'ramda'
import {DBEventParty} from './sqlite/dbschema.js'
import { addRecord, makeRecordSet } from '../lib/record.js'

function makeEventParty(){  
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
function list( rec, respHdl ){ 
    if( R.isNil(rec.filter.pid ) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'], 
                              ['fkTypeEvent','n'], ['fkParty','n'] ] )  
    DBEventParty.list( rs, rec.filter, rec.ord, rec.nav, respHdl )
}

/*
* Сконструировать пустую запись
* { "initRec": initRec, "method":method, "insImmediatly": insImmediatly }
* initRec -  поля для инициализации записи
* method -  имя метода чей формат нам  нужно возвратить при инициализации
* insImmediatly - сразу добавить запись
* Возвращает: запись формата метода чье имя передано в method
*/
function  init( { initRec, method, insImmediatly }, respHdl ){     
    if( R.isNil(initRec.fkParty ) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')  
    if( R.isNotNil(insImmediatly) && insImmediatly === true ){
        const respIns = ( err, id )=>{
            if( R.isNotNil(err) ){
                respHdl(err, null)
                return
            }
            console.log( `id=${id}`)
            list( {filter:{ pid: initRec.fkParty, ids:[id] }, ord:null, nav:null }, respHdl )
        }
        insert( initRec, respIns ) 
    } else {
        let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'], ['evTypeName','s'], 
        ['dtStart','t'], ['fkTypeEvent','n'], ['fkParty','n'] ] )  
        addRecord( rs, initRec )
        respHdl(null, rs)
    }
}


/**
 * Прочитать по идентификатору событие между собойчика
 * @param {*} rec запись в которой обязательно присутствует pkID  - идентификатор события и 
 *                      идентификатор междусобойчика filter.fkPartyID
 * @param {*} respHdl 
 * * @returns RecordSet из 1 записи
 */
function read( rec, respHdl) { 
    if( R.isNil(rec.filter.fkParty ) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    if( R.isNil(rec.filter.pkID) )
        respHdl(null,null)
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'], ['evTypeName','s'], 
                              ['dtStart','t'], ['fkParty','n'] ] )  
    DBEventParty.read( rs, rec.filter, respHdl )
}

/*
* @param rec формат
{
    ids: [ <список id на удаление событий междусобойчика> ]
    pid: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( rec, respHdl ) { 
if( R.isNil(rec.fkParty) )
    throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
if( R.isNil(rec.ids) || R.isEmpty(rec.ids) )
    respHdl(null,0)
DBEventParty.remove( rec, respHdl )

}

/* Добавить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    if( R.isNil(rec.fkParty) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    DBEventParty.insert( rec, respHdl )
}

/* Обновить запись события междусобойчика   
* @param {*} rec запись {pkID, fkParty, name }
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей, т.е. единица
*/
function update(rec, respHdl ){
    if( R.isNil(rec.fkParty) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    DBEventParty.update( rec, respHdl )

}
        
return Object.freeze({
    list,
    read,
    remove,
    insert,
    update,
    init
})

}
export const EventParty = makeEventParty()