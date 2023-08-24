//import * as R from 'ramda'
import {DBEventParty} from '../sqlite/dbschema.js'
import { PartyDate } from '../../lib/partyday.js'



test("DBEventParty.update(rec}", done => {
    const rec = { pkID:1, name:"Cултаны Свинга 2025", dtStart: PartyDate.toTS('13.09.23 11:00:00'), 
                  description: "Супер соревнования" }
    const resHdl = ( err, updated )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(updated).toEqual(1)
            done()
        }
        catch(err){
            done(err)
        }
    }
    DBEventParty.update( rec, resHdl)
})

test("DBEventParty.remove({pid:1,ids:[1]}", done => {
    const rec = {pid:1,ids:[1] } 
    const resHdl = ( err, removed )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(removed).toEqual(1)
            done()
        }
        catch(err){
            done(err)
        }
    }
    DBEventParty.remove( rec, resHdl)
})


test("DBEventParty.insert(rec}", done => {
    const rec = { name:"Cултаны Свинга 2023", dtStart: PartyDate.toTS('13.10.23 11:00:00'), 
                 fkEventType: 1, fkParty: 1, description: "Класcные соревнования" }
    const resHdl = ( err, id )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(id).toBeGreaterThan(0)
            done()
        }
        catch(err){
            done(err)
        }
    }
    DBEventParty.insert( rec, resHdl)
})
