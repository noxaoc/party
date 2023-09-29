/*
* Задания этапа события. Каждый этап может содержать несколько заданий. Переход в следующий этап определяется
* по суммарному результату прохождения всех заданий этапа. Например, в boogie-woogie этап "Отборы"(Qualification First Round)
* состоит из двух заданий 'Fast Boogie-Woogie" и "Slow Boogie-Woogie" длительностью 75 секунд, а  
* "Тур надежды"(Qualification Second Round) состоит только из 'Fast Boogie-Woogie'. Некоторые этапы могут проскакивать, например
* некоторые участники этапа "Отборы" в boogie-woogie пропускают Qualification Second Round, а некоторые вообще пропускают 
* Qualification( сеяные пары )
* 
*/
import { PartyService } from "./lib/remoteCallParty"
import * as R from "ramda"
import { getChgFldsRec } from "../lib/record"

function  makeTaskStageEvent(){

/*
* Список заданий этапа
filter = {
    ids: [<идентификаторы заданий>]
}
*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/taskstageevent/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/*
*
*/
function read( filter, setResult, setError ){
    PartyService.post( "/taskstageevent/read",{ "filter": filter}, setResult, setError)
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
    PartyService.post( "/taskstageevent/init",{ ...rec }, setResult, setError)
}
    

/* 
* Удалить задание этапа
* @param rec = 
{
    fkParty: <идентификатор междусобойчика, обязателен>
    ids: [<идентификаторы заданий, которые надо удалить>]
}
если ids пуст, ничего не удалится
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/taskstagevent/remove", rec, setResult, setError)
}

/* Добавить задание этапа 
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан id добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/taskstageevent/insert",  { ...rec, ...getChgFlds(rec) }, setResult, setError)
}

/* Обновить задание этапа  
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/taskstageevent/update",  { ...rec, ...getChgFlds(rec) } , setResult, setError)
}

function getChgFlds( rec ){
    const frmt = [ ['pkID','n'], ['name','s'], ['description','s'], ['fkStage','n'], ['dtStart','t'], ['fkParty','n'],
                   ['temp','n'], ['type','s'] ] 
    return getChgFldsRec( frmt, rec )
}

function upsert( rec,  setResult, setError )
{
    if( R.isNil(rec.pkID) )
        TaskStageEvent.insert(rec,  setResult, setError )
    else
        TaskStageEvent.update(rec,  setResult, setError )
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

export const TaskStageEvent = makeTaskStageEvent()