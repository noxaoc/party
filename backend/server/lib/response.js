/* Ответ на POST запросы всегда в формате
{r:<result>,e:{msg:<error msg>, uuid:<error_uid>}|null}
msg и uuid необязательны
*/
function makePostResponseOK( result ){
    console.log(result)
    return { r: result, e: null }
}

function makePostResponseError( msg, error_uuid ){
    return { r: null, e: { msg: msg, uuid: error_uuid } }
}

export function  getResult( func, arg, response ){
   
    const setResponse = ( err, result )=>{
        if( err )
            response.status(500).json(makePostResponseError(err,null))
        else
            response.status(200).json(makePostResponseOK(result))
    }
    func(arg, setResponse)
}
