import * as R from 'ramda'
import {DBParty} from './sqlite/dbschema.js'
import { addRecord, makeRecordSet } from '../lib/record.js'
import { PartyDate } from '../lib/partyday.js'

function makeParty(){  
/**
 * 
 * @param {*} ext 
 * @param {*} filter  - задает фильтрацию  списка 
 *                        { searchStr:<подстрока поиска по имени>}
 * @param {*} ord  - задает сортировку списка
 * @param {*} nav  - задает навигацию списка 
 *                    { page: <номер страницы>, 
 *                      cnt:< кол - во записей на странице> }
 * @returns RecordSet
 */      
function list( rec, respHdl ){ 
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'], ['place','s'], 
                              ['dtStart','d'], ['dtEnd','d'],
                              ['outgoing','n'], ['payment','n'], ['profit','n'], ] )  
    DBParty.list( rs, rec.filter, rec.ord, rec.nav, respHdl )
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
    if( R.isNotNil(insImmediatly) && insImmediatly === true ){
        const respIns = ( err, id )=>{
            if( R.isNotNil(err) ){
                respHdl(err, null)
                return
            }
            console.log( `id=${id}`)
            list( {filter:{ ids:[id] }, ord:null, nav:null }, respHdl )
        }
        insert( initRec, respIns ) 
    } else {
        let rs = makeRecordSet( [   ['pkID','n'], ['name','s'], ['description','s'], ['place','s'], 
                                    ['dtStart','d'], ['dtEnd','d'],
                                    ['outgoing','n'], ['payment','n'], ['profit','n'], ]  )  
        const rec = {   name:"", description:"", place:"", dtStart: PartyDate.getCurrDate(), 
                        dtEnd: PartyDate.getCurrDate(), outgoing: 0, payment:0, profit: 0, ...initRec }
        addRecord( rs, rec )
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
    if( R.isNil(rec.pkID) ){
        respHdl(null,null)
        return
    }
    let rs = makeRecordSet([ ['pkID','n'], ['name','s'], ['description','s'], ['place','s'], 
                             ['dtStart','d'], ['dtEnd','d'],
                             ['outgoing','n'], ['payment','n'], ['profit','n'] ]  )  
    DBParty.read( rs, rec, respHdl )
}

/*
* @param rec формат
{
    ids: [ <список id на удаление междусобойчика> ]
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, если удаление прошло нормально
*/
function remove( rec, respHdl ) { 
if( R.isNil(rec.ids) || R.isEmpty(rec.ids) ){
    respHdl(null,0)
    return
}
DBParty.remove( rec, respHdl )

}

/* Добавить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    DBParty.insert( rec, respHdl )
}

/* Обновить запись события междусобойчика   
* @param {*} rec запись {pkID, name, ... }
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей, т.е. единица
*/
function update(rec, respHdl ){
    DBParty.update( rec, respHdl )

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
export const Party = makeParty()