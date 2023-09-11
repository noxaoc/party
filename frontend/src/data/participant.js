/*
Получение информации об участниках междусобойчика
*/
import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeParticipant(){
  
/*
    getSchema(){
        // required - true обязательное поле, not null. Если отсутствует null допустим
        // type - тип (number, string, boolean, bigint)
        return { headers: [
             {name:"id", required: true, unique:true, type: "number"},
             {name:"name", required: false, type: "string"},
             {name:"evTypeName",required: true,  type: "number"},
             {name:"dtStart", required: true, type: "object"},
             {name:"description",required: false,  type: "string"},
            ]
        }
    }
*/

/*
* Список участников междусобойчика
filter = {
    searchStr: <подстрока поиска по названию  события>  
    ids: [<идентификаторы событий>],
    fkParty: <идентификатор междусобойчика>
}

*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/participant/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/* Получит информацию о конкретном участнике
* filter = {
    pkID: <идентификатор участника>
    fkParty: <идентификатор междусобойчика>
}
*/
function read( filter, setResult, setError ){
    PartyService.post( "/participant/read",{ "filter": filter}, setResult, setError)
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
    PartyService.post( "/participant/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить участников междусобойчика
* @param rec = 
{
    fkParty: <идентификатор междусобойчика, обязателен>
    ids: [<идентификаторы событий, которые надо удалить>]
}
если ids пуст, ничего не удалится
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/Participant/list
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/participant/remove", rec, setResult, setError)
}

/* Добавить запись об участнике междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан pkID добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/participant/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/participant/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

/**
 * Список полей которые могут меняться
 * @param {*} rec 
 * @returns 
 */
function getChgFlds( rec ){
    const frmt = [  ['pkID','n'],  ['fkParty','n'], ['num', 'n'],
                    ['name','s'],  ['surname','s'], ['patronymic','s'],
                    ['club','s'],  ['email','s'],   ['phone','s'],
                    ['dtReg','d'], ['role','s'],    ['price','n'], 
                    ['paid','n'],  ['comment','s']  ]
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        Participant.insert(rec,  setResult, setError )
    else
        Participant.update(rec,  setResult, setError )
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

export const Participant = makeParticipant()