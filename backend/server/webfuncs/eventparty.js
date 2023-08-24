import { EventParty} from '../models/eventparty'
import { getResult } from '../lib/response'


export const list = ( req, res, next )=>{
    console.log(req.body)
    getResult(EventParty.list, req.body, res )
}

/*
{"filter":{"pid":1,"id":1}}
*/
export const read = ( req, res, next )=>{
    console.log(req.body)
    getResult(EventParty.read, req.body, res )
}

/*
{"filter":{"pid":1,"ids":[1,2]}}
*/
export const remove = ( req, res, next )=>{
    console.log(req.body)
    getResult(EventParty.remove, req.body, res )
}

/*
{rec:{"pkParty":1,"name":"", ...}}
*/
export const insert = ( req, res, next )=>{
    console.log(req.body)
    getResult(EventParty.insert, req.body, res )
}

/*
{rec:{"pkID":1, "pkParty":1,"name":"", ...}}
*/
export const update = ( req, res, next )=>{
    console.log(req.body)
    getResult(EventParty.update, req.body, res )
}