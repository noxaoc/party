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
  console.log(msg);
  return {
    r: null,
    e: {
      msg: msg,
      uuid: error_uuid
    }
  };
}
function getResult(func, arg, response) {
  var setResponse = function setResponse(err, result) {
    if (err) response.status(500).json(makePostResponseError(err, null));else response.status(200).json(makePostResponseOK(result));
  };
  func(arg, setResponse);
}