import * as R from 'ramda'
import {DBEventParty} from './sqlite/dbschema.js'
import { makeRecordSet } from '../lib/record.js'

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
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  
    DBEventParty.list( rs, rec.filter, rec.ord, rec.nav, respHdl )
}

/**
 * Прочитать по идентификатору событие между собойчика
 * @param {*} rec запись в которой обязательно присутствует id  - идентификатор события и 
 *                      идентификатор междусобойчика filter.pid
 * @param {*} respHdl 
 * * @returns RecordSet из 1 записи
 */
function read( rec, respHdl) { 
    if( R.isNil(rec.filter.pid ) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    if( R.isNil(rec.filter.id) )
        respHdl(null,null)
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  
    DBEventParty.read( rs, rec.filter, respHdl )
}

/*
rec
{
    ids: [ <список id на удаление> ]
    pid: <идентификатор междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( rec, respHdl ) { 
if( R.isNil(rec.filter.pid ) )
    throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
if( R.isNil(rec.filter.ids) || R.isEmpty(rec.filter.ids) )
    respHdl(null,0)
DBEventParty.remove( rec.filter, respHdl )

}

/*    
* @param {*} rec запись {rec:{}}
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    if( R.isNil(rec.pkParty) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    DBEventParty.insert( rec.rec, respHdl )
}

/*    
* @param {*} rec запись {rec:{}}
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей
*/
function update(rec, respHdl ){
    if( R.isNil(rec.pkParty) )
        throw Error('Работа невозможна, так как не удалось определить идентификатор междусобойчика!')
    DBEventParty.pdate( rec.rec, respHdl )

}
        
        return Object.freeze({
            list,
            read,
            remove,
            insert,
            update
        });
    }
export const EventParty = makeEventParty()