import { Participant } from '../participant.js'
import * as R from "ramda"
import { makePlainObjByIdx, makeRecordSet } from '../../lib/record.js'
import { PartyDate } from '../../lib/partyday.js'
import { NotUndefinedValueErr, NotEmptyValueErr, NotNullValueErr } from '../lib/errors.js'
import { makeHdl, recordDoesNotExistHdl, notNullValueHdl, notUndefinedValueHdl, makeCheckReadHdl } from './lib/testhdl.js'

describe("Participant.update", ()=>{

// оптимистичное обновление
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
    const checkF =  updated =>{
        expect(updated).toEqual(1)
        // проверяем совпадение того что записали
        Participant.read( { pkID:1, fkParty:1 }, makeCheckReadHdl(done,rec) ) 

    }
    Participant.update( rec, makeHdl( done, checkF) )
})

// обновляем с fkParty = undefined
test("Participant.update({pkID:1})", done => {
    const rec = {   "pkID": 1, "num": 12 }
    Participant.update( rec, makeHdl( done, notUndefinedValueHdl )) 
})

// обновляем с fkParty = null
test("Participant.update(fkParty:null,pkID:1)", done => {
    const rec = { "pkID": 1, fkParty: null, "num": 12 }
    Participant.update( rec, makeHdl( done, notNullValueHdl )) 
})

// обновляем с pkID = null
test("Participant.update({pkID:null, fkParty:1})", done => {
    const rec = { "pkID": null, fkParty: 1, "num": 12 }
    Participant.update( rec, makeHdl( done, notNullValueHdl )) 
})

// обновляем с pkID = undefined
test("Participant.update({fkParty:1})", done => {
    const rec = { "fkParty": 1, "num": 12 }
    Participant.update( rec, makeHdl( done, notUndefinedValueHdl )) 
})

})

describe("Participant.remove", ()=>{

// Оптимистичный сценарий удаления существующей записи
test("Participant.remove({ids:[1],fkParty:1})", done => {
    const rec = { ids:[1],fkParty:1 } 
    Participant.remove( rec, makeHdl( done, removed => expect(removed).toEqual(1) ) )
})

// удаление записи c несколькими ids
test("Participant.remove({ids:[7,8], fkParty:1})", done => {
    const rec = { ids:[7,8],fkParty:1 } 
    Participant.remove( rec, makeHdl( done, removed => expect(removed).toEqual(2) ) )
})

// удаление записи без fkParty
test("Participant.remove({ids:[3]})", done => {
    const rec = { ids:[3] } 
    Participant.remove( rec, makeHdl(done, notUndefinedValueHdl ) ) 
})

// удаление записи c пустым ids
test("Participant.remove({ids:[], fkParty:1})", done => {
    const rec = { ids:[],fkParty:1 } 
    Participant.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotEmptyValueErr) ) )
})

// удаление записи без ids
test("Participant.remove({fkParty:1})", done => {
    const rec = { fkParty:1 } 
    Participant.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotUndefinedValueErr) ) )
})
// удаление записи c ids = null
test("Participant.remove({ids:null,fkParty:1})", done => {
    const rec = { ids: null, fkParty:1 } 
    Participant.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotNullValueErr) ) )
})

})

describe("Participnat.insert", ()=> {

// Оптимистичная вставка участника    
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
    const checkF = id => {
        expect(id).toBeGreaterThan(0)
        Participant.read( { pkID: id, fkParty:1 }, makeCheckReadHdl(done, { ...rec, pkID: id })  )
    }
    Participant.insert( rec, makeHdl( done, checkF ) )
})

    
test("Participant.insert({ fkParty: null, name: Вася })", done => {
    const rec = {   "fkParty": null, name: "Вася" }
    Participant.insert( rec, makeHdl( done, notNullValueHdl ) )
})

test("Participant.insert({ name: Вася })", done => {
    const rec = { name: "Вася" }
    Participant.insert( rec, makeHdl( done, notUndefinedValueHdl ) )
})

})

describe("Participant.init", ()=>{
// оптимистичная инициализация    
test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ name: "Беларусь", fkParty: 1}, method: "Participant.list" }
    const checkF = rSet =>{
        expect(R.length(rSet)).toEqual(2)
        const rec = makePlainObjByIdx(rSet,0)
        expect( rec.name ).toEqual("Беларусь")
        expect( rec.fkParty ).toEqual(1)
        expect( rec.pkID ).toBeUndefined()
        expect( rec.num).toEqual(23)
    }
    Participant.init( initRec, makeHdl( done, checkF) )
})

// fkParty = undefined   
test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ name: "Беларусь"}, method: "Participant.list" }
    Participant.init( initRec, makeHdl( done, notUndefinedValueHdl) )
})

// fkParty = null  
test("Participant.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ name: "Беларусь", fkParty: null }, method: "Participant.list" }
    Participant.init( initRec, makeHdl( done, notNullValueHdl) )
})

})

describe("Participant.list", () => {

// оптимистичный  список
test("Participant.list({ids:[],fkParty:1})", done => {
    const filter = { filter:{ ids:[], fkParty:1 } }
    Participant.list( filter, makeHdl( done, rSet => expect(R.length(rSet)).toEqual(7) ) )
})

test("Participant.list({ids:[]})", done => {
    const filter = { filter:{ ids:[] } }
    Participant.list( filter, makeHdl( done, notUndefinedValueHdl ) )
})

test("Participant.list({ids:[],fkParty:null})", done => {
    const filter = { filter:{ ids:[], fkParty: null } }
    Participant.list( filter, makeHdl( done, notNullValueHdl ) )
})

// чтение списка по фильтру отбирающему одну запись
test("Participant.list({ids:[9],fkParty:1})", done => {
    const filter = { filter:{ ids:[9], fkParty:1 } }
    const checkF = rSet => {
        expect(R.length(rSet)).toEqual(2)
        const rc0 = makePlainObjByIdx(rSet,0)
        expect(rc0.pkID).toEqual(9)
    }
    Participant.list( filter, makeHdl( done, checkF ) )
})

// чтение списка по фильтру отбирающему 2 записи
test("Participant.list({ids:[9,10],fkParty:1})", done => {
    const filter = { filter:{ ids:[9,10], fkParty:1 } }
    const checkF = rSet => {
        expect(R.length(rSet)).toEqual(3)
        const rc0 = makePlainObjByIdx(rSet,0)
        expect(rc0.pkID).toEqual(9)
        const rc1 = makePlainObjByIdx(rSet,1)
        expect(rc1.pkID).toEqual(10)
    }
    Participant.list( filter, makeHdl( done, checkF ) )
})

// чтение списка по фильтру отбирающему запись по имени
test("Participant.list({searchStr, fkParty:1})", done => {
    const filter = { filter:{ searchStr:"Миши", fkParty:1 } }
    const checkF = rSet => {
        expect(R.length(rSet)).toEqual(2)
        const rc = makePlainObjByIdx(rSet)
        expect(rc.surname).toEqual("Мишин")
    }
    Participant.list( filter, makeHdl( done, checkF) )
})

})


describe( "Participant.read",() => {
// оптимистичное чтение
test("Participant.read({pkID:3,fkParty:1})", done => {
    const checkF =  rSet =>{
        expect( R.isNil(rSet) ).toBeFalsy()
        expect(R.length(rSet)).toEqual(2)
        const rc = makePlainObjByIdx(rSet)
        expect(rc.pkID).toEqual(3)
    }

    Participant.read( {pkID:3, fkParty: 1}, makeHdl(done,checkF) )
})

// fkParty = null
test("Participant.read({pkID:3,fkParty:null})", done => {
    Participant.read( {pkID:3, fkParty: null}, makeHdl(done,notNullValueHdl) )
})

// fkParty = undefined
test("Participant.read({pkID:3,})", done => {
    Participant.read( {pkID:3}, makeHdl(done,notUndefinedValueHdl) )
})

// pkID = undefined
test("Participant.read({ fkParty: 1})", done => {
    Participant.read( {fkParty:1}, makeHdl(done,notUndefinedValueHdl) )
})

// pkID = null
test("Participant.read({pkID:null,fkParty:null})", done => {
    Participant.read( {pkID:null, fkParty: null}, makeHdl(done,notNullValueHdl) )
})

//  чтение несуществующей записи
test("Participant.read({pkID:100})", done => {
    Participant.read( {pkID:100, fkParty: 1}, makeHdl(done, recordDoesNotExistHdl) )
})

})