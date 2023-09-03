import { Party} from '../models/party'
import { getResult } from '../lib/response'


export const list = ( req, res, next )=>{
    console.log(req.body)
    getResult(Party.list, req.body, res )
}

/*
{"pkID":1}
*/
export const read = ( req, res, next )=>{
    console.log(req.body)
    getResult(Party.read, req.body, res )
}

/*
{"filter":{"ids":[1,2]}}
*/
export const remove = ( req, res, next )=>{
    console.log(req.body)
    getResult(Party.remove, req.body, res )
}

/*
{rec:{ "name":"", ...}}
*/
export const insert = ( req, res, next )=>{
    console.log(req.body)
    getResult(Party.insert, req.body, res )
}

/*
{rec:{"pkID":1, "name":"", ...}}
*/
export const update = ( req, res, next )=>{
    console.log(req.body)
    getResult(Party.update, req.body, res )
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
    getResult(Party.init, req.body, res )
}
