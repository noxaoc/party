/*
Получение информации о событиях междусобойчика
*/


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
Список событий междусобойчика
filter = {
    searchStr: <подстрока поиска по названию  события>
    ids: [<идентификаторы событий>]
}
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1},"ord":null,"nav":null}' http://localhost:3333/party/eventparty/list
*/    
function  list( filter, ord, nav ){
const partyURL = "http://localhost:3333/party"
            
let promise = fetch( partyURL +"/event_party/list", 
{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({"filter":{"pid":1},"ord":null,"nav":null})
})
.then(response => response.json())
.then(result => console.log(result))



}

function read(){

}

return Object.freeze({
    list,
    read
})

}

export const EventPart = makeEventParty()