/*
* Mock - webfunc
*/
import { MockStageEventParty } from "./stageEventParty"

const onMock = true


let webFuncs = {
    "/stageeventparty/list":MockStageEventParty.list,
}
/**
 * 
 * @param {*} webfunc 
 * @param {*} rec 
 * @param {*} hdl
 * @return null если нет mock
 */
export function  CallMockWebFunc(webfunc_name,rec, hdl ){
    if( onMock !== true )
        return false
    const webFunc = webFuncs[webfunc_name]
    if( !webFunc )
        return false
    webFunc(rec,hdl)
    return true
}