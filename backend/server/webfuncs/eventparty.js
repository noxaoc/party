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