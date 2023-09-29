/*
*  Cудейская карточка участника по задания этапа
*  Содержит информацияю о судье, участнике которого он судил и результат судейства
*  Результат может рассчитываться по результатм различных критериев судейства
*  
*/


import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeCardJudgee(){
  
/*  Результаты задания по участникам
filter = {
    searchStr: <подстрока поиска по имени участника>,
    num: <поиск по номеру участника>
    fkParty: <идентификатор междусобойчика>,
    fkTask: <идентификатор задания>
}
*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/cardjudge/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/*
*
*/
function read( filter, setResult, setError ){
    PartyService.post( "/cardjudge/read",{ "filter": filter}, setResult, setError)
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
    PartyService.post( "/cardjudge/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить судейские карточки
* @param rec = 
{
    fkParty: <идентификатор междусобойчика>
    ids: [<идентификаторы карточек, которые надо удалить>]
}
если ids пуст, ничего не удалится
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/cardjudge/remove", rec, setResult, setError)
}

/* Добавить запись о судейской краточк 
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан id добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/cardjudge/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить запись  судейскую карточку  
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/cardjudge/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

function getChgFlds( rec ){
    const frmt = [ ['pkID','n'], ['fkParticipant','n'], ['place','n'], ['fkTask','n'], ['fkParty','n'],
                   ['total','n'] ] 
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        CardJudgee.insert(rec,  setResult, setError )
    else
        CardJudgee.update(rec,  setResult, setError )
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

export const CardJudgee = makeCardJudgee()