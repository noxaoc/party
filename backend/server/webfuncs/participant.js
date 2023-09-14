import { Participant } from '../models/participant'
import { getResult } from '../lib/response'

/*
{ "filter":{ "ids":[1,2]} }     
*/
export const list = ( req, res, next )=>{
    console.log(req.body)
    getResult(Participant.list, req.body, res )
}

/*
{"pkID":1}
*/
export const read = ( req, res, next )=>{
    console.log(req.body)
    getResult(Participant.read, req.body, res )
}

/*
{ "filter":{"ids":[1,2]} } 
       
*/
export const remove = ( req, res, next )=>{
    console.log(req.body)
    getResult(Participant.remove, req.body, res )
}

/*
{rec:{ "fkParty":"1", ...}}
*/
export const insert = ( req, res, next )=>{
    console.log(req.body)
    getResult(Participant.insert, req.body, res )
}

/*
{rec:{"pkID":1, "fkParty":"1", ...}}
*/
export const update = ( req, res, next )=>{
    console.log(req.body)
    getResult(Participant.update, req.body, res )
}

/*
* Сконструировать пустую запись
* { "initRec": initRec, "method":method, "insImmediatly": insImmediatly }
* initRec -  поля для инициализации записи
* method -  имя метода чей формат нам  нужно возвратить при инициализации
* insImmediatly - сразу добавить запись
* Возвращает: запись формата метода чье имя передано в method
*/
export const init = (  req, res, next )=>{
    console.log(req.body)
    getResult(Participant.init, req.body, res )
}
