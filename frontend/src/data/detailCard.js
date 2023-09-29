/*
*  Результаты выполнения задания этапа участниками
*  
* Участник  Судья1 .... CудьяN   Реультирующий балл  Место
*  num - Номер участника
*  fullname - Полное имя участника
*  fkParticipant
*  
*/


import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeDetailCard(){
  
/*  Результаты задания по участникам
filter = {
    searchStr: <подстрока поиска по имени участника>,
    num: <поиск по номеру участника>
    fkParty: <идентификатор междусобойчика>,
    fkTask: <идентификатор задания>
}
*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/detailcard/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/*
*
*/
function read( filter, setResult, setError ){
    PartyService.post( "/detailcard/read",{ "filter": filter}, setResult, setError)
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
    PartyService.post( "/detailcard/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить результаты участников
* @param rec = 
{
    fkParty: <идентификатор междусобойчика>
    ids: [<идентификаторы результатов, которые надо удалить>]
}
если ids пуст, ничего не удалится
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/detailcard/list
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/detailcard/remove", rec, setResult, setError)
}

/* Добавить запись о результате участника  
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан id добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/detailcard/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить запись результат участника   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/detailcard/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

function getChgFlds( rec ){
    const frmt = [ ['pkID','n'], ['fkParticipant','n'], ['place','n'], ['fkTask','n'], ['fkParty','n'],
                   ['total','n'] ] 
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        DetailCard.insert(rec,  setResult, setError )
    else
        DetailCard.update(rec,  setResult, setError )
}

return Object.freeze({
    list,
    read,
    remove,
    insert,
    update,
    upsert,
    init
})

}

export const DetailCard = makeDetailCard()