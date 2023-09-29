/* 
* Задания этапа
* dtStart время начала прохождения задания
* name - название задания
* fkStage - этап которому принадлежит задание
* fkParty - междусобойчик
*/

import { makeRecordSet, addRecord } from "../../lib/record"
import * as R from 'ramda'
import { PartyDate } from "../../lib/partyday"

let  tasksStageEvent =[
{
    pkID: 1,
    dtStart: PartyDate.toTS("01.05.23 10:00:00"),
    name:"Slow Boogie-Woogie",
    fkStage:1, 
    fkParty:1,
    temp:120,
    description:"",
},
{
    pkID: 2,
    dtStart: PartyDate.toTS("01.05.23 12:00:00"),
    name:"Fast Boogie-Woogie",
    fkStage:1, 
    fkParty:1,
    temp:200,
    description:"",
},

]


export class MockTasksStageEvent{
    static list(rec,hdl){
        const frmt = [ ['pkID','n'], ['name','s'], ['description','s'], ['fkStage','n'], 
                       ['dtStart','t'], ['fkParty','n'], ['temp','n'] 
                     ] 
        
        let rs = makeRecordSet(frmt)
        R.forEach( rc => addRecord(rs,rc), tasksStageEvent )
        hdl({r:rs, e:null})
    }
}