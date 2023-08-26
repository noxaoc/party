import { TypeEventParty} from '../models/typeevent'
import { getResult } from '../lib/response'

export const all = ( req, res, next )=>{
    console.log(req.body)
    getResult(TypeEventParty.all, req.body, res )
}
