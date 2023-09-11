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
                              ['dtReg','t'], ['role','s'],
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
                                ['dtReg','t'], ['role','s'],
                                ['price','n'], ['paid','n'], ['comment','s'] ] ) 

    const nextNumWrapper = ( err, nextNum )=>{
        const newRec = { num: nextNum, name:"", surname:"", patronymic:"", dtReg: PartyDate.getCurrDate(), phone:"",
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
    getNextNum( initRec.fkParty, nextNumWrapper )
}

/*
* Каждый участник может иметь уникальный номер, необходимый для выступлений. Кто - то может и не хотеть.
* все номера в пределах междусобойчика уникальный т.е. уникальность соблюдается при одном и том же fkParty
* так как участников всегда немного обычно менее сотни, то вполне генерацию номера можно делать на стороне клиента
* единственная проблема, можно сформировать один и тот же номер
* свободныt незанятых отсортированных в порядке возрастания номеров участников для каждого междусобойчика
   междусобойчики различаются gid - ом
   номера - положительные числа начинающиеся с 1
формат:
{
    <gid>: [список свободных номеров междусобойчика],
}
 элемент списка свободных номеров междусобойчика это следующий номер после максимального используемого участником
в междусобойчике
*
// минимальный стартовый номер участника междусобойчика
const startNum = () => 1
function initNum( gid ){
    return R.compose( R.reduce( R.max, startNum()), R.map((elem)=>elem.num),
                     R.filter( R.whereEq({ gid: gid} ) ) ) (participants) + 1
}
// так как номера ограничены, их могут вообще печатать заранее, мы не можем ими разбрасываться
let gFreeNums = {}
// следующий максимальный номер после максимального уже используемого участником
function getFreeNum(gid){
    if( R.isNil(gid) )
        return null;
    let freeNums = gFreeNums[gid]
    if( R.isNil(freeNums) )
    {
        freeNums=[initNum(gid)]
        gFreeNums[gid]=freeNums
    }
    const freeNum = freeNums.shift()
    if( R.isEmpty(freeNums) )
        freeNums.push(freeNum + 1)
    console.log(`freeNum=${freeNum}`)
    return freeNum
}

// вернуть неиспользумый номер в список свободных номеров
function addUnusedNum( gid, num ){
    if( R.isNil(gid) || R.isNil(num) || num <= 0 )
        return
    let freeNums = gFreeNums[gid]
    if( R.isNil(freeNums) )
        gFreeNums[gid]=[num]
    else
        freeNums.unshift(num)
}

*/

/*
* Получить следующий номер участника
*/
function getNextNum ( fkParty, respHdl ){
    DBParticipant.getNextNum( fkParty, respHdl )
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
                             ['dtReg','t'], ['role','s'],
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