/*
Получение информации о событиях междусобойчика
*/
import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeStageEventParty(){

/*
* Список событий междусобойчика
filter = {
    searchStr: <подстрока поиска по названию  события>
    ids: [<идентификаторы событий>]
}
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1},"ord":null,"nav":null}' http://localhost:3333/party/eventparty/list
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  

*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/stageeventparty/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/*
*
*/
function read( filter, setResult, setError ){
    PartyService.post( "/stageeventparty/read",{ "filter": filter}, setResult, setError)
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
    PartyService.post( "/stageeventparty/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить события междусобойчика
* @param rec = 
{
    pid: <идентификатор междусобойчика, обязателен>
    ids: [<идентификаторы событий, которые надо удалить>]
}
если ids пуст, ничего не удалится
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/stageeventparty/list
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/stageeventparty/remove", rec, setResult, setError)
}

/* Добавить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан id добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/stageeventparty/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/stageeventparty/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

function getChgFlds( rec ){
    const frmt = [ ['pkID','n'], ['name','s'], ['description','s'], ['fkEvent','s'], ['dtStart','t'], ['fkParty','n'],
                   ['judgement','s'], ['countParticipants','n'] ] 
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        StageEventParty.insert(rec,  setResult, setError )
    else
        StageEventParty.update(rec,  setResult, setError )
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

export const StageEventParty = makeStageEventParty()