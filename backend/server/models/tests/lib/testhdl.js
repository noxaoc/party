/*
* Вспомогоательные обработчики
*/
import { PartyErr, NotEmptyValueErr, NotNullValueErr, NotUndefinedValueErr, RecordDoesNotExistErr } from "../../lib/errors"


export const makeHdl = ( done, expectFunc )=>{
    return ( err, res ) =>{
        if( err ){
            if( err instanceof PartyErr ){
                expectFunc( err )
                done()
            }
            else
                done(err)
            return
        }
        try{
            expectFunc(res)
            done()
        }
        catch(err){
            done(err)
        }
    }
}

/*
* Обработчик на проверку null - значения
*/
export const notNullValueHdl =  err => expect(err).toBeInstanceOf( NotNullValueErr) 

/*
* Обработчик на проверку undefined - значения
*/
export const notUndefinedValueHdl = err => expect(err).toBeInstanceOf( NotUndefinedValueErr) 

/*
* Обработчик на проверку пустого - значения. {} для объектов, [] - для массивов, '' - для строк
*/
export const notEmptyValueHdl = err => expect(err).toBeInstanceOf( NotEmptyValueErr) 

/*
* Обработчик на проверку существования записи
*/
export const recordDoesNotExistHdl = err => expect(err).toBeInstanceOf( RecordDoesNotExistErr) 