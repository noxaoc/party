/*
Получение информации о событиях междусобойчика
*/
import { PartyService } from "./lib/remoteCallParty"

function  makeEventParty(){
  
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
* Список событий междусобойчика
filter = {
    searchStr: <подстрока поиска по названию  события>
    ids: [<идентификаторы событий>]
}
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1},"ord":null,"nav":null}' http://localhost:3333/party/eventparty/list
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  

*/    
function  list( filter, ord, nav, setResult, setError  ){     
PartyService.post( "/eventparty/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

/*
*
*/
function read( filter, setResult, setError ){
    PartyService.post( "/eventparty/read",{ "filter": filter}, setResult, setError)
}

/* 
* Удалить события междусобойчика
* @param rec = 
{
    pid: <идентификатор междусобойчика, обязателен>
    ids: [<идентификаторы событий, которые надо удалить>]
}
если ids пуст, ничего не удалится
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/eventparty/list
*/  
function remove( rec, setResult, setError ){
    PartyService.post( "/eventparty/remove", rec, setResult, setError)
}

/* Добавить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*}  setResult будет передан id добавленной записи
*/ 
function insert( rec, setResult, setError ){
    PartyService.post( "/eventparty/insert", rec, setResult, setError)
}

/* Обновить запись о событии междусобойчика   
* @param {*} rec обычного формата {name, description, fkParty ...}
* @param {*} setResult будет передано ко-во обновленных записей, т.е. единица
*/ 
function update( rec, setResult, setError ){
    PartyService.post( "/eventparty/update", rec, setResult, setError)
}

return Object.freeze({
    list,
    read,
    remove,
    insert,
    update
})

}

export const EventParty = makeEventParty()