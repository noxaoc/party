/*
Получение информации о типах событий в междусобойчике
*/
import { PartyService } from "./lib/remoteCallParty"
import { makeListPlainObj } from "../lib/record"

function  makeTypeEventParty(){
/*
* Список типов событий междусобойчика

формат [ ['pkID','n'], ['name','s'], ['description','s'], ['evTypeName','s'] ] )  
возвращает [{ pkID, name, description }]

*/    

function  all( setResult, setError  ){ 
    const resHdl =  rSet => { setResult( makeListPlainObj(rSet) ) }
    PartyService.post( "/typeevent/all", {}, resHdl, setError)
}
    
return Object.freeze({
    all
})
    
}
    
export const TypeEventParty = makeTypeEventParty()