import {DBTypeEventParty} from './sqlite/dbschema.js'
import { makeRecordSet } from '../lib/record.js'

function makeTypeEventParty(){  
    
function all( rec, respHdl ){ 
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'] ] )  
    DBTypeEventParty.all( rs, respHdl )
}
return Object.freeze({
    all
})

}

export const TypeEventParty = makeTypeEventParty()