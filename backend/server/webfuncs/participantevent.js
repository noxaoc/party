import { ParticipantEvent } from '../models/participant_event'
import { getResult } from '../lib/response'

/*
{ "filter":{ "searchStr": "подстрока для поиска", "ids":[1,2]} }     
*/
export const list = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.list, req.body, res )
}

/*
{"pkID":1}
*/
export const read = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.read, req.body, res )
}

/*
{ "filter":{"ids":[1,2]} } 
       
*/
export const remove = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.remove, req.body, res )
}

/*
{rec:{ "name":"", ...}}
*/
export const insert = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.insert, req.body, res )
}

/*
{rec:{"pkID":1, "name":"", ...}}
*/
export const update = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.update, req.body, res )
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
    getResult(ParticipantEvent.init, req.body, res )
}

/**
 * Добавить события в которых хочет участвовать участник, если событие уже было добавлено ранее
 * то его добавление будет пропущено
*/
export const insertselected = ( req, res, next )=>{
    console.log(req.body)
    getResult(ParticipantEvent.insertSelected, req.body, res )
}