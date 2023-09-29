/*
* Mock - webfunc
*/
import { MockStageEventParty } from "./stageEventParty"
import { MockTotalsTask } from "./cardJudge"
import { MockTasksStageEvent } from "./taskStage"

const onMock = true


let webFuncs = {
    "/stageeventparty/list": MockStageEventParty.list,
    "/totaltaskstage/list": MockTotalsTask.list,
    "/taskstageevent/list": MockTasksStageEvent.list,
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