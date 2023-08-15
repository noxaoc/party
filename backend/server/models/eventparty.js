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
        throw 'Работа невозможна, так как не удалось определить идентификатор междусобойчика!'
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
        throw 'Работа невозможна, так как не удалось определить идентификатор междусобойчика!'
    if( R.isNil(rec.filter.id) )
        respHdl(null,null)
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  
    DBEventParty.read( rs, rec.filter, respHdl )
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
    export const EventParty = makeEventParty()