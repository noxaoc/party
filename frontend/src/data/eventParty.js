/*
Получение информации о событиях междусобойчика
*/


function  makeEventParty(){

const  partyURL = ()=> "http://localhost:3333/party"     

function remoteCall( method,  rec, setResult, setError ){
    console.log(method)
    const getResult = ( { r, e } )=>{
        if( r === undefined || e === undefined ){
            console.log("Неожиданный ответ от сервера!")
            setResult(undefined)
        }
        else if( r === null && e !== null ){
            console.log(e)
            setResult(undefined)
        }else
            setResult(r)
    } 
    fetch( partyURL() + method, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(rec)
    })
    .then( response => response.json(), err=>console.log(err.message) )
    .then( getResult, setError)    
}
    
    
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
remoteCall( "/eventparty/list",{ "filter": filter, "ord":ord,"nav":nav}, setResult, setError)
}

function read( filter, setResult, setError ){
    remoteCall( "/eventparty/read",{ "filter": filter}, setResult, setError)
}

/*
Список событий междусобойчика
filter = {
    pid: <идентификатор междусобойчика>
    ids: [<идентификаторы событий>]
}
curl -i -H 'Content-Type: application/json;charset=utf-8' -d '{"filter":{"pid":1, "ids":[1,2]}}' http://localhost:3333/party/eventparty/list
*/  
function remove( filter, setResult, setError ){
    remoteCall( "/eventparty/remove",{ "filter": filter}, setResult, setError)
}

return Object.freeze({
    list,
    read,
    remove
})

}

export const EventParty = makeEventParty()