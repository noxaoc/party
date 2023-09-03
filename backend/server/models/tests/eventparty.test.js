//import * as R from 'ramda'
import {DBEventParty,DBTypeEventParty} from '../sqlite/dbschema.js'
import { EventParty } from '../eventparty.js'
import * as R from "ramda"
import { makePlainObjByIdx, makeRecordSet } from '../../lib/record.js'
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

test("DBEventParty.remove({fkParty:1,ids:[1]}", done => {
    const rec = {fkParty:1,ids:[1] } 
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

test("DBTypeEventParty.all", done => {
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(5)
            done()
        }
        catch(err){
            done(err)
        }
    }
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'] ] )  
    DBTypeEventParty.all( rs, resHdl)
})

test("EventParty.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ fkParty: 1}, method: "EventParty.list" }
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(2)
            const rec = makePlainObjByIdx(rSet,0)
            expect( rec.fkParty ).toEqual(1)
            expect( rec.pkID ).toBeNull()
            done()
        }
        catch(err){
            done(err)
        }
    }
    EventParty.init( initRec, resHdl )
})

test("EventParty.init({initRec: initRec, method:list, insImmediatly: true })", done => {
    const initRec = { initRec:{ fkParty: 1, fkTypeEvent: 1}, method: "EventParty.list", insImmediatly: true }
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
           // console.log(rSet)
            expect(R.length(rSet)).toEqual(2)
            const rec = makePlainObjByIdx(rSet,0)
            expect( rec.fkParty ).toEqual(1)
            expect( rec.pkID ).toBeGreaterThan(0)
            done()
        }
        catch(err){
            done(err)
        }
    }
    EventParty.init( initRec, resHdl )
})