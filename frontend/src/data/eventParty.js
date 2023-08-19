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
    let rs = makeRecordSet( [ ['id','n'], ['name','s'], ['description','s'], ['evTypeName','s'], ['dtStart','t'] ] )  

*/    
function  list( filter, ord, nav, setResult, setError ){
const partyURL = "http://localhost:3333/party"
            
fetch( partyURL +"/eventparty/list", 
{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({"filter":{"pid":1},"ord":null,"nav":null})
})
.then(response => response.r.json())
.then(setResult, setError)
}

function read(){

}

return Object.freeze({
    list,
    read
})

}

export const EventParty = makeEventParty()