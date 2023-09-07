import { Participant } from '../participant.js'
import * as R from "ramda"
import { makePlainObjByIdx, makeRecordSet } from '../../lib/record.js'
import { PartyDate } from '../../lib/partyday.js'

/*
*  Обработчик для сравнения образцовой записи rec с прочитанным результатом rSet
*/
const resReadHdl = ( rec, done ) => {
    return ( err, rSet ) => {
        if( err ){
            done(err)
            return
        }
        try{
            const readRec = makePlainObjByIdx(rSet)
            expect(readRec).toEqual(rec)
            done()
        }
        catch(err){
            done(err)
        }
    }
}

const participantRead = ( filter, rec, done )=>{
    // проверяем совпадение того что записали
    Participant.read( filter, resReadHdl( rec, done) )
}


test("Participant.update(rec)", done => {
    const rec = {   "pkID": 1,
                    "fkParty": 1,
                    "num": 12,
                    "surname": "Букин",
                    "patronymic": "Власович",
                    "name":"Святослав",
                    "phone": "+7(960)978-77-77",
                    "email": "svg@gmail.com",
                    "dtReg": PartyDate.toTS( "06.03.23 00:12:00" ),
                    "club":"Savoy",
                    "role": "leader",
                    "price": 6000,
                    "paid": 3000,
                    "comment":"Обратить внимание"
                }
    const resUpdHdl = ( err, updated )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(updated).toEqual(1)
            // проверяем совпадение того что записали
            participantRead( { pkID:1, fkParty:1 }, rec, done )
        }
        catch(err){
            done(err)
        }
    }
    Participant.update( rec, resUpdHdl )
})

test("Participant.remove({ids:[2],fkParty:1})", done => {
    const rec = { ids:[1],fkParty:1 } 
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
    Participant.remove( rec, resHdl )
})


test("Participant.insert(rec)", done => {
    const rec = {   "fkParty": 1,
                    "num": 22,
                    "surname": "Лосев",
                    "patronymic": "Власович",
                    "name":"Святослав",
                    "phone": "+7(960)999-99-99",
                    "email": "css@gmail.com",
                    "dtReg": PartyDate.toTS( "07.03.23 11:12:00" ),
                    "club":"Cotton Club",
                    "role": "leader",
                    "price": 6010,
                    "paid": 2000,
                    "comment":"Ничего"
                }
    const resInsHdl = ( err, id )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(id).toBeGreaterThan(0)
            participantRead( { pkID: id, fkParty:1 }, { ...rec, pkID: id }, done )
        }
        catch(err){
            done(err)
        }
    }
    Participant.insert( rec, resInsHdl)
})

test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ name: "Беларусь", fkParty: 1}, method: "Participant.list" }
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(2)
            const rec = makePlainObjByIdx(rSet,0)
            expect( rec.name ).toEqual("Беларусь")
            expect( rec.fkParty ).toEqual(1)
            expect( rec.pkID ).toBeUndefined()
            done()
        }
        catch(err){
            done(err)
        }
    }
    Participant.init( initRec, resHdl )
})


test("Participant.list({ids:[],fkParty:1})", done => {
    const filter = { filter:{ ids:[], fkParty:1 } }
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect(R.length(rSet)).toEqual(9)
            done()
        }
        catch(err){
            done(err)
        }
    }
   
    Participant.list( filter, resHdl )
})

test("Participant.read({pkID:1,fkParty:1})", done => {
    const resHdl = ( err, rSet )=>{
        if( err ){
            done(err)
            return
        }
        try{
            expect( R.isNil(rSet) ).toBeFalsy()
            expect(R.length(rSet)).toEqual(2)
            const partyRec = makePlainObjByIdx(rSet)
            expect(partyRec.pkID).toEqual(2)
            done()
        }
        catch(err){
            done(err)
        }
    }

    Participant.read( {pkID:1, fkParty: 1}, resHdl )
})

