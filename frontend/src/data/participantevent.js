/*
Получение информации об участниках междусобойчика
*/
import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeParticipantEvent(){

/*
* Список событий участника
filter = {
    ids: [<идентификаторы событий>],
    fkParty: <идентификатор междусобойчика>
    fkParticipant: <идентификатор участника>
}

*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/participantevent/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/* Получит информацию о конкретном событии участника
* filter = {
    pkID: <идентификатор собатия участника>
    fkParty: <идентификатор междусобойчика>
}
*/
function read( filter, setResult, setError ){
    PartyService.post( "/participantevent/read",{ "filter": filter}, setResult, setError)
}

/*
* Сконструировать пустую запись
* { "initRec": initRec, "method":method, "insImmediatly": insImmediatly }
* initRec -  поля для инициализации записи
* method -  имя метода чей формат нам  нужно возвратить при инициализации
* insImmediatly - сразу добавить запись
* Возвращает: запись формата метода чье имя передано в method
*/
function  init( rec, setResult, setError  ){     
    PartyService.post( "/participantevent/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить события участника
* @param rec = 
{
    fkParty: <идентификатор междусобойчика, обязателен>
    ids: [<идентификаторы событий участника, которые надо удалить>]
}
если ids пуст, ничего не удалится
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/participantpvent/list
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/participantevent/remove", rec, setResult, setError)
}

/* Добавить запись о событии в котором заинтересован участник   
* @param {*} rec обычного формата {price,, fkParty ...}
* @param {*}  setResult будет передан pkID добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/participantevent/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить запись о событии участника   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/participantevent/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

/**
 * Добавить события в которых хочет участвовать участник, если событие уже было добавлено ранее
 * то его добавление будет пропущено
 * @param {*} rec объект формата { ids, fkParty, fkParticipant }
 * ids - список идентифкаторов событий которые надо связать с участником fkParticipant
 * ids и fkParticipant должны принадлежать междусобойчику fkParty
 * @param {*} setResult 
 * @param {*} setError 
 */
function insertSelected( rec , setResult, setError){
    PartyService.post( "/participantevent/insertselected",  { ...rec } , setResult, setError)
}


/**
 * Список полей которые могут меняться
 * @param {*} rec 
 * @returns 
 */
function getChgFlds( rec ){
    const frmt = [  ['pkID','n'],  ['fkParty','n'], ['fkParticipant', 'n'],
                    ['fkEvent','s'],  ['price','s'], ['comment','s'] ]
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        ParticipantEvent.insert(rec,  setResult, setError )
    else
        ParticipantEvent.update(rec,  setResult, setError )
}

return Object.freeze({
    list,
    read,
    remove,
    insert,
    update,
    upsert,
    init,
    insertSelected
})

}

export const ParticipantEvent = makeParticipantEvent()