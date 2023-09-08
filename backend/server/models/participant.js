import * as R from 'ramda'
import {DBParticipant} from './sqlite/dbschema.js'
import { addRecord, makeRecordSet } from '../lib/record.js'
import { PartyDate } from '../lib/partyday.js'
import { checkFkParty, checkIds, checkRec } from './lib/utils.js'

function makeParticipant(){  
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
    if( !checkFkParty(rec.filter, respHdl) ) return
    let rs = makeRecordSet( [ ['pkID','n'], ['fkParty','n'], ['num', 'n'],
                              ['name','s'],  ['surname','s'], ['patronymic','s'],
                              ['club','s'],  ['email','s'], ['phone','s'],
                              ['dtReg','d'], ['role','s'],
                              ['price','n'], ['paid','n'], ['comment','s'] ] )  
    DBParticipant.list( rs, rec.filter, rec.ord, rec.nav, respHdl )
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
    if( !checkFkParty( initRec, respHdl) ) return
    let rs = makeRecordSet( [   ['fkParty','n'], ['num', 'n'],
                                ['name','s'],  ['surname','s'], ['patronymic','s'],
                                ['club','s'],  ['email','s'], ['phone','s'],
                                ['dtReg','d'], ['role','s'],
                                ['price','n'], ['paid','n'], ['comment','s'] ] ) 

    const newRec = {   name:"", suranme:"", patronymic:"", dtReg: PartyDate.getCurrDate(), phone:"",
                club: "", email: "", role: "leader", price:0, paid: 0, comment:"", ...initRec }
    if( R.isNotNil(insImmediatly) && insImmediatly === true ){
        const respIns = ( err, id )=>{
            if( R.isNotNil(err) ){
                respHdl(err, null)
                return
            }
            //console.log( `id=${id}`)
            list( {filter:{ ids:[id] }, ord:null, nav:null }, respHdl )
        }
        insert( newRec, respIns ) 
    } else {
        addRecord( rs, newRec )
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
    if( !checkRec(rec, respHdl) ) return
    let rs = makeRecordSet([ ['pkID','n'], ['fkParty','n'], ['num', 'n'],
                             ['name','s'],  ['surname','s'], ['patronymic','s'],
                             ['club','s'],  ['email','s'], ['phone','s'],
                             ['dtReg','d'], ['role','s'],
                             ['price','n'], ['paid','n'], ['comment','s'] ] ) 
    DBParticipant.read( rs, rec, respHdl )
}

/*
* @param rec формат
{
    ids: [ <список id на удаление участников> ],
    fkParty: <id междусобойчика>
}
* @param {*} respHdl (err, res) в res будет кол-во удаленных записей, 
* если удаление прошло нормально, если ничего не удалили, то 0
* precondition: fkParty is not null or is not undefined
*               ids is not null or is not undefined or is not empty
* если precondition не выполнены, то re
*/
function remove( rec, respHdl ) { 
if( !checkFkParty(rec, respHdl) ) return
if( !checkIds(rec, respHdl) ) return
DBParticipant.remove( rec, respHdl )
}

/* Добавить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} respHdl (err, res) в res будет id добавленной записи
*/
function insert( rec, respHdl ) { 
    if( !checkFkParty(rec, respHdl) ) return
    DBParticipant.insert( rec, respHdl )
}

/* Обновить запись события междусобойчика   
* @param {*} rec запись {pkID, name, ... }
* @param {*} respHdl (err, res) в res будет кол-во обновленных записей, т.е. единица
*/
function update(rec, respHdl ){
    if( !checkRec(rec, respHdl) ) return
    DBParticipant.update( rec, respHdl )
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
export const Participant = makeParticipant()