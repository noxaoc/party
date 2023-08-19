"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResult = getResult;
/* Ответ на POST запросы всегда в формате
{r:<result>,e:{msg:<error msg>, uuid:<error_uid>}|null}
msg и uuid необязательны
*/
function makePostResponseOK(result) {
  return {
    r: result,
    e: null
  };
}
function makePostResponseError(msg, error_uuid) {
  return {
    r: null,
    e: {
      msg: msg,
      uuid: error_uuid
    }
  };
}
/*
export function setCORSHeader( response, method ){
    response.set({
        'Access-Control-Allow-Methods': 'POST, OPTIONS'  ,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
    })
    if( method === 'OPTIONS')
        response.status(200)
}
*/
function getResult(func, arg, response) {
  // разрешаем CORS для POST c http://localhost:3000
  // setCORSHeader(response,'POST')
  var setResponse = function setResponse(err, result) {
    if (err) response.status(500).json(makePostResponseError(err, null));else response.status(200).json(makePostResponseOK(result));
  };
  func(arg, setResponse);
}