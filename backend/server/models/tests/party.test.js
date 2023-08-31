import {DBParty} from '../sqlite/dbschema.js'
import { Party } from '../party.js'
import * as R from "ramda"
import { makePlainObjByIdx, makeRecordSet } from '../../lib/record.js'
import { PartyDate } from '../../lib/partyday.js'



test("DBParty.update(rec}", done => {
    const rec = { pkID:1, name:"Cултаны Свинга 2025", 
                          dtStart: PartyDate.toTS('13.09.23 11:00:00'), 
                          dtEnd: PartyDate.toTS('15.09.23 11:00:00'),
                          place: "Москва",
                          outgoing: 5,
                          payment: 100,
                          profit: 95,
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
    DBParty.update( rec, resHdl)
})

test("DBParty.remove({ids:[1]})", done => {
    const rec = {ids:[1] } 
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
    DBParty.remove( rec, resHdl )
})


test("DBParty.insert(rec}", done => {
    const rec = {   name:"LindyTime 2023", 
                    dtStart: PartyDate.toTS('13.09.23 11:00:00'), 
                    dtEnd: PartyDate.toTS('15.09.23 11:00:00'),
                    place: "Москва",
                    outgoing: 5,
                    payment: 100,
                    profit: 95,
                    description: "Супер соревнования" }
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
    DBParty.insert( rec, resHdl)
})

test("Party.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ place: "Беларусь"}, method: "Party.list" }
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(2)
            const rec = makePlainObjByIdx(rSet,0)
            expect( rec.place ).toEqual("Беларусь")
            expect( rec.pkID ).toBeNull()
            done()
        }
        catch(err){
            done(err)
        }
    }
    Party.init( initRec, resHdl )
})

test("DBParty.list({ids:[]})", done => {
    const filter = {ids:[] } 
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(3)
            done()
        }
        catch(err){
            done(err)
        }
    }
   
    let rs = makeRecordSet( [ ['pkID','n'], ['name','s'], ['description','s'], ['place','s'], 
                              ['dtStart','d'], ['dtEnd','d'],
                              ['outgoing','n'], ['payment','n'], ['profit','n'] ] )
    DBParty.list( rs, filter, null, null, resHdl )
})
