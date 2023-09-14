/**
* Утилиты для вызова backend "Междусобойчика"
*/
import * as R from  "ramda"

function  makePartyService(){

    const  partyURL = () => "http://localhost:3333/party"     
    
    function post( method,  rec, setResult, setError ){
        console.log(method)
        console.log( rec )
        const defaultErrHdl = ( err ) => {
            console.log( `Ошибка ${err.message} вызова ${method}`)
        }
        const defaultSetResult = () => {
        }
        const setRes =  R.isNil(setResult) ? defaultSetResult : setResult
        const getResult = ( { r, e } )=>{
            if( r === undefined || e === undefined ){
                console.log("Неожиданный ответ от сервера!")
                setRes(undefined)
            }
            else if( r === null && e !== null ){
                console.log(e)
                setRes(undefined)
            }else
                setRes(r)
        } 
        fetch( partyURL() + method, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(rec)
        })
        .then( response => response.json(), err=>console.log(err.message) )
        .then( getResult, R.isNil(setError) ? defaultErrHdl : setError )    
    }
        
    return Object.freeze({
        post
    })
    
    }
    
    export const PartyService = makePartyService()