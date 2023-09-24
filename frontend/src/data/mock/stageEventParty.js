/*
Mock - данные для этапов события
*/
import * as R from 'ramda'
import { addRecord, makeRecordSet } from '../../lib/record'
import { PartyDate } from '../../lib/partyday'

/*
type - вид этапа для соревнований ( competition)
qualification_1 - отборы первый тур
qualification_2 - отборы второй тур ( тур надежды)
1/8_final - 
1/4_final - четверть финала
1/2_final - полуфинал
final - финал
knockout - не помню

judgment -  система судейства
"skating"
"yes_no_maybe"   - кол - во участников X. X-1 - максимально yes, и 2 maybe
"wrrc_boogie"

temp - bpm ( beat per minute)

stageNum - порядок этапов от 0 и выше

*/

let  stagesEventParty =[
    {
        pkID: 1,
        stageNum: 0,
        dtStart: PartyDate.toTS("01.05.23 10:00:00"),
        name:"Отборы",
        type:"1_qualification",
        fkEvent:1, 
        fkParty:1,
        judgment:"yes_no_maybe",
        temp:192,
        countJudges:5,
        description:"",
        toNextStage:12,
        countParticipants: 30
    },
    {
        pkID: 2,
        stageNum: 1,
        dtStart: PartyDate.toTS("01.05.23 12:00:00"),
        name:"Тур надежды",
        type:"2_qualification",
        fkEvent:1, 
        fkParty:1,
        judgment:"yes_no_maybe",
        temp:192,
        countJudges:5,
        description:"",
        toNextStage:12
    },
    {
        pkID: 3,
        stageNum: 2,
        dtStart: PartyDate.toTS("01.05.23 14:00:00"),
        name:"1/4 Финала",
        type:"1/4_final",
        fkEvent:1, 
        fkParty:1,
        judgment:"skating",
        temp:200,
        countJudges:5,
        description:"",
        toNextStage:12
    },
    {
        pkID: 4,
        stageNum: 3,
        dtStart: PartyDate.toTS("01.05.23 16:00:00"),
        name:"1/2 Финала",
        type:"1/2_final",
        fkEvent:1, 
        fkParty:1,
        judgment:"skating",
        temp:204,
        countJudges:5,
        description:"",
        toNextStage:12
    },
    {
        pkID: 5,
        stageNum: 4,
        dtStart: PartyDate.toTS("01.05.23 18:00:00"),
        name:"Финал",
        type:"final",
        fkEvent:1, 
        fkParty:1,
        judgment:"skating",
        temp:208,
        countJudges:7,
        description:"",
        toNextStage:6
    }
]

export class MockStageEventParty{

    static list(rec,hdl){
        const frmt = [ ['pkID','n'], ['name','s'], ['description','s'], ['fkEvent','s'], 
                       ['dtStart','t'], ['fkParty','n'], ['type','s'], ['judgment','s'],  
                       ['temp','n'],['countJudges','n'],['toNextStage','n'],['countParticipant','n']
                    ] 
        
        let rs = makeRecordSet(frmt)
        R.forEach( rc => addRecord(rs,rc), stagesEventParty)
        hdl({r:rs, e:null})
    }
}