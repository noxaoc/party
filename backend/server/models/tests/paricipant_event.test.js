import { ParticipantEvent } from '../participant_event.js'
import * as R from "ramda"
import { DBTest } from '../sqlite/dbschema.js'
import { makePlainObjByIdx } from '../../lib/record.js'
import { NotUndefinedValueErr, NotEmptyValueErr, NotNullValueErr } from '../lib/errors.js'
import { makeHdl, recordDoesNotExistHdl, notNullValueHdl, notUndefinedValueHdl, makeCheckReadHdl } from './lib/testhdl.js'


describe("ParticipantEvent.update", ()=>{

// оптимистичное обновление
test("ParticipantEvent.update(rec)", done => {
    const rec = {   pkID: 1,
                    fkParty: 1,
                    fkParticipant:1,
                    fkEvent: 1,
                    comment: "test",
                    price: 200,
                    role: "follower"
                }
    const checkF =  updated =>{
        expect(updated).toEqual(1)
        // проверяем совпадение того что записали
        ParticipantEvent.read( { pkID:1, fkParty:1 }, makeCheckReadHdl(done,rec) ) 

    }
    ParticipantEvent.update( rec, makeHdl( done, checkF) )
})

// обновляем с fkParty = undefined
test("ParticipantEvent.update({pkID:1})", done => {
    const rec = {   "pkID": 1, "price": 120 }
    ParticipantEvent.update( rec, makeHdl( done, notUndefinedValueHdl )) 
})

// обновляем с fkParty = null
test("ParticipantEvent.update(fkParty:null,pkID:1)", done => {
    const rec = { "pkID": 1, fkParty: null, "price": 120 }
    ParticipantEvent.update( rec, makeHdl( done, notNullValueHdl )) 
})

// обновляем с pkID = null
test("ParticipantEvent.update({pkID:null, fkParty:2})", done => {
    const rec = { "pkID": null, fkParty: 2, "price": 12 }
    ParticipantEvent.update( rec, makeHdl( done, notNullValueHdl )) 
})

// обновляем с pkID = undefined
test("ParticipantEvent.update({fkParty:1})", done => {
    const rec = { "fkParty": 2, "price": 12 }
    ParticipantEvent.update( rec, makeHdl( done, notUndefinedValueHdl )) 
})

})


describe("Participant.insert", ()=> {

// Оптимистичная вставка участника    
test("ParticipantEvent.insert(rec)", done => {
    const rec = {   fkParty:1,
                    fkParticipant: 1,
                    fkEvent: 2,
                    price: 333,
                    role:"leader",
                    comment:"И что?"
                }
    const checkF = id => {
        expect(id).toBeGreaterThan(0)
        ParticipantEvent.read( { pkID: id, fkParty:1 }, makeCheckReadHdl(done, { ...rec, pkID: id })  )
    }
    ParticipantEvent.insert( rec, makeHdl( done, checkF ) )
})

    
test("ParticipantEvent.insert({ fkParty: null, price: 111 })", done => {
    const rec = {   "fkParty": null, price: 111 }
    ParticipantEvent.insert( rec, makeHdl( done, notNullValueHdl ) )
})

test("ParticipantEvent.insert({ price: 111 })", done => {
    const rec = { price: 111 }
    ParticipantEvent.insert( rec, makeHdl( done, notUndefinedValueHdl ) )
})

})


describe("ParticipantEvent.init", ()=>{

// оптимистичная инициализация    
test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ price: 111, fkParty: 1, fkParticipant: 1 }, method: "ParticipantEvent.list" }
    const checkF = rSet =>{
        expect(R.length(rSet)).toEqual(2)
        const rec = makePlainObjByIdx(rSet,0)
        expect( rec.price ).toEqual(111)
        expect( rec.fkParty ).toEqual(1)
        expect( rec.pkID ).toBeUndefined()
        expect( rec.fkParticipant ).toEqual(1)
    }
    ParticipantEvent.init( initRec, makeHdl( done, checkF ) )
})

// fkParty = undefined   
test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ price: 333 }, method: "ParticipantEvent.list" }
    ParticipantEvent.init( initRec, makeHdl( done, notUndefinedValueHdl) )
})

// fkParty = null  
test("ParticipantEvent.init({initRec: initRec, method:list, insImmediatly: false })", done => {
    const initRec = { initRec:{ price: 333, fkParty: null }, method: "ParticipantEvent.list" }
    ParticipantEvent.init( initRec, makeHdl( done, notNullValueHdl) )
})

})


describe("ParticipantEvent.list", () => {

beforeEach( done  => {
    DBTest.reInitDatabase(done)
})

// оптимистичный  список
test("ParticipantEvent.list({ ids:[], fkParty:1, fkParticipant:1 })", done => {
    const filter = { filter:{ ids:[], fkParty:1, fkParticipant:1 } }
    ParticipantEvent.list( filter, makeHdl( done, rSet => { expect(R.length(rSet)).toEqual(3)} ) )
})

test("ParticipantEvent.list({ids:[]})", done => {
    const filter = { filter:{ ids:[], fkParticipant:1 } }
    ParticipantEvent.list( filter, makeHdl( done, notUndefinedValueHdl ) )
})

test("ParticipantEvent.list({ids:[],fkParty:null, fkParticipant:1})", done => {
    const filter = { filter:{ ids:[], fkParty: null, fkParticipant:1 } }
    ParticipantEvent.list( filter, makeHdl( done, notNullValueHdl ) )
})

// чтение списка по фильтру отбирающему одну запись
test("ParticipantEvent.list({ids:[1],fkParty:1, fkParticipant:1})", done => {
    const filter = { filter:{ ids:[1], fkParty:1, fkParticipant:1 } }
    const checkF = rSet => {
        expect(R.length(rSet)).toEqual(2)
        const rc0 = makePlainObjByIdx(rSet,0)
        expect(rc0.pkID).toEqual(1)
    }
    ParticipantEvent.list( filter, makeHdl( done, checkF ) )
})

// чтение списка по фильтру c fkParticipant = null
test("ParticipantEvent.list({ids:[],fkParty:1, fkParticipant:null})", done => {
    const filter = { filter:{ ids:[], fkParty: 1, fkParticipant: null} }
    ParticipantEvent.list( filter, makeHdl( done, notNullValueHdl ) )
})

// чтение списка по фильтру c fkParticipant = undefined
test("ParticipantEvent.list({ids:[],fkParty:1 })", done => {
    const filter = { filter:{ ids:[], fkParty: 1 } }
    ParticipantEvent.list( filter, makeHdl( done, notUndefinedValueHdl ) )
})

// чтение списка по фильтру отбирающему 2 записи
test("ParticipantEvent.list({ids:[1,2],fkParty:1, fkParticipant:1})", done => {
    const filter = { filter:{ ids:[1,2], fkParty:1, fkParticipant:1 } }
    const checkF = rSet => {
        expect(R.length(rSet)).toEqual(3)
        const rc0 = makePlainObjByIdx(rSet,0)
        expect(rc0.pkID).toEqual(1)
        const rc1 = makePlainObjByIdx(rSet,1)
        expect(rc1.pkID).toEqual(2)
    }
    ParticipantEvent.list( filter, makeHdl( done, checkF ) )
})

})

describe( "ParticipantEvent.read", () => {
// оптимистичное чтение
test("ParticipantEvent.read({pkID:1,fkParty:1})", done => {
    const checkF =  rSet =>{
        expect( R.isNil(rSet) ).toBeFalsy()
        expect(R.length(rSet)).toEqual(2)
        const rc = makePlainObjByIdx(rSet)
        expect(rc.pkID).toEqual(1)
        const flds = ['pkID', 'fkParty', 'fkEvent', 'fkParticipant', 'role', 'price', 'comment' ] 
        const findNull = fld =>{
            return fld in rc ? false : true
        }  
        const arr = R.filter( findNull , flds )
        expect(R.length(arr)).toEqual(0)
    }

    ParticipantEvent.read( {pkID:1, fkParty: 1}, makeHdl(done,checkF) )
})

// fkParty = null
test("ParticipantEvent.read({pkID:1,fkParty:null})", done => {
    ParticipantEvent.read( {pkID:1, fkParty: null}, makeHdl(done,notNullValueHdl) )
})

// fkParty = undefined
test("ParticipantEvent.read({pkID:1})", done => {
    ParticipantEvent.read( {pkID:1}, makeHdl(done,notUndefinedValueHdl) )
})

// pkID = undefined
test("ParticipantEvent.read({ fkParty: 1})", done => {
    ParticipantEvent.read( {fkParty:1}, makeHdl(done,notUndefinedValueHdl) )
})

// pkID = null
test("ParticipantEvent.read({pkID:null,fkParty:null})", done => {
    ParticipantEvent.read( {pkID:null, fkParty: null}, makeHdl(done,notNullValueHdl) )
})

//  чтение несуществующей записи
test("ParticipantEvent.read({pkID:100})", done => {
    ParticipantEvent.read( {pkID:100, fkParty: 1}, makeHdl(done, recordDoesNotExistHdl) )
})

})


describe("ParticipantEvent.remove", ()=>{

// Оптимистичный сценарий удаления существующей записи
test("ParticipantEvent.remove({ids:[2],fkParty:1})", done => {
    const rec = { ids:[2],fkParty:1 } 
    ParticipantEvent.remove( rec, makeHdl( done, removed => expect(removed).toEqual(1) ) )
})

// удаление записи c несколькими ids
test("ParticipantEvent.remove({ids:[3,4], fkParty:1})", done => {
    const rec = { ids:[3,4],fkParty:1 } 
    ParticipantEvent.remove( rec, makeHdl( done, removed => expect(removed).toEqual(2) ) )
})

// удаление записи без fkParty
test("ParticipantEvent.remove({ids:[1]})", done => {
    const rec = { ids:[1] } 
    ParticipantEvent.remove( rec, makeHdl(done, notUndefinedValueHdl ) ) 
})

// удаление записи c пустым ids
test("ParticipantEvent.remove({ids:[], fkParty:1})", done => {
    const rec = { ids:[],fkParty:1 } 
    ParticipantEvent.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotEmptyValueErr) ) )
})

// удаление записи без ids
test("ParticipantEvent.remove({fkParty:1})", done => {
    const rec = { fkParty:1 } 
    ParticipantEvent.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotUndefinedValueErr) ) )
})
// удаление записи c ids = null
test("ParticipantEvent.remove({ids:null,fkParty:1})", done => {
    const rec = { ids: null, fkParty:1 } 
    ParticipantEvent.remove( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotNullValueErr) ) )
})

})

describe("ParticipantEvent.insertSelected", ()=>{

    // Оптимистичный сценарий вставки выбранных записей
    test("ParticipantEvent.insertSelected({ids:[2],fkParty:1, fkParticipant: 1})", done => {
        const rec = { ids:[3,4],fkParty:1, fkParticipant: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl( done, res => expect(res).toBeTruthy() ) )
        // надо проверит что правильная сумма подставляется
    })

     // Оптимистичный сценарий вставки выбранных записей которые уже есть,
     // т.е. они не должны добавиться
     test("repeat ParticipantEvent.insertSelected({ids:[3,4],fkParty:1, fkParticipant: 1})", done => {
        const rec = { ids:[3,4],fkParty:1, fkParticipant: 1 } 
        const filter = { filter:{ fkParty:1, fkParticipant:1 } }
        const  makeAfterInsert = count => {
            return (err, res) => {
                const cntList = rSet => {
                    expect(rSet).not.toBeNull()
                    expect( count).toEqual(R.length(rSet)) // количество записей до вставки и после должно совпадать    
                }
                ParticipantEvent.list( filter, makeHdl( done, cntList ) )
            }
        }

        // читаем список до
        const countList = (err, rSet) => {
            expect(rSet).not.toBeNull()
            const count = R.length(rSet) // количество записей до вставки
            ParticipantEvent.insertSelected( rec,  makeAfterInsert(count) )
        }
        ParticipantEvent.list( filter, countList ) 
    })
    
    // вставка с пустым ids
    test("ParticipantEvent.insertSelected({ids:[], fkParty:1, fkParticipant: 1})", done => {
        const rec = { ids:[], fkParty:1, fkParticipant: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl( done, res => expect(res).toBeTruthy() ) )
    })
    
    // вставка без fkParty
    test("ParticipantEvent.insertSelected({ids:[1], fkParticipant: 1})", done => {
        const rec = { ids:[1], fkParticipant: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl(done, notUndefinedValueHdl ) ) 
    })

     // вставка  fkParty: null
     test("ParticipantEvent.insertSelected({ids:[1], fkParticipant: 1, fkParty: null})", done => {
        const rec = { ids:[1], fkParticipant: 1, fkParty: null } 
        ParticipantEvent.insertSelected( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotNullValueErr) ) ) 
    })

    // вставка без fkParticipant
    test("ParticipantEvent.insertSelected({ids:[1], fkParticipant: 1})", done => {
        const rec = { ids:[1], fkParty: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl(done, notUndefinedValueHdl ) ) 
    })

     // вставка  fkParticipant: null
     test("ParticipantEvent.insertSelected({ids:[1], fkParticipant: null, fkParty: 1})", done => {
        const rec = { ids:[1], fkParticipant: null, fkParty: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotNullValueErr) ) ) 
    })
    
    // вставка без ids
    test("ParticipantEvent.insertSelected({fkParty:1, fkParticipant: 1})", done => {
        const rec = { fkParty:1, fkParticipant: 1} 
        ParticipantEvent.insertSelected( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotUndefinedValueErr) ) )
    })
    // вставка c ids = null
    test("ParticipantEvent.insertSelected({ ids:null, fkParty:1, fkParticipant:1 })", done => {
        const rec = { ids: null, fkParty:1, fkParticipant: 1 } 
        ParticipantEvent.insertSelected( rec, makeHdl(done, err => expect(err).toBeInstanceOf(NotNullValueErr) ) )
    })
    
    

})

