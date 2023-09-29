import { makeRecordSet, addRecord } from "../../lib/record"
import * as R from 'ramda'
/* 
* Судейская карточка участника по заданию
* заданием может быть танец Slow, Fast Boogie-Woogie
* dtStart время начала прохождения задания
* name - название участника, пары, группы
* fkTask - ссылка на задание
* fkParty - междусобойчик
* fkJudge - судья
* nameJudge имя судьи
* num - номер участника, пары, группы
* total - суммарный бал по карточке, он может складываться из видов оценки в зависимости от задачи и способой
* судейства
*/

let  cardsJudge =[
    {
        pkID: 1,
        fkParticipant:1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        fkJudge:1,
        nameJudge: "Петр",
        total:10,
        description:"",
    },
    {
        pkID: 1,
        fkParticipant:1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        fkJudge:2,
        nameJudge: "Василий",
        total:12,
        description:"",
    },
    {
        pkID: 1,
        fkParticipant:1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        fkJudge:3,
        nameJudge: "Ирина",
        total:11,
        description:"",
    },
    {
        pkID: 1,
        fkParticipant:1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        fkJudge:4,
        nameJudge: "Светлана",
        total:12,
        description:"",
    },
    {
        pkID: 1,
        fkParticipant:1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        fkJudge:5,
        nameJudge: "Мария",
        total:13,
        description:"",
    },
]
    
/* Итоговые результаты задачи участника по всем судейстким карточкам
*
*/
let totalsTask = [
    { 
        pkID: 1,
        name: "Терентьев-Башарина",
        num:1,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:12, fkCard: 1}, { numJudge:2, total:10, fkCard: 2},
            { numJudge:3, total:13, fkCard: 3}, { numJudge:4, total:12, fkCard: 4},
            { numJudge:5, total:11, fkCard: 5},
        ],
        total:13,
        place: 1,
        description:"",
    },
    { 
        pkID: 2,
        name: "Матвеев-Громова",
        num:2,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:10, fkCard: 6 }, { numJudge:2, total:9, fkCard: 7 },
            { numJudge:3, total:12, fkCard: 8 }, { numJudge:4, total:11, fkCard: 9 },
            { numJudge:5, total:11, fkCard: 10 },
        ],
        total:13,
        place: 12,
        description:"",
    },
    { 
        pkID: 3,
        name: "Чабанец-Еременка",
        num:3,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:11, fkCard: 11 }, { numJudge:2, total:11, fkCard: 12 },
            { numJudge:3, total:13, fkCard: 13 }, { numJudge:4, total:9, fkCard: 14 },
            { numJudge:5, total:10, fkCard: 15 },
        ],
        total:13,
        place: 12,
        description:"",
    },
    { 
        pkID: 4,
        name: "Гаврилов-Гаврилова",
        num:4,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:13, fkCard: 16 }, { numJudge:2, total:11, fkCard: 17 },
            { numJudge:3, total:13, fkCard: 18 }, { numJudge:4, total:10, fkCard: 19 },
            { numJudge:5, total:14, fkCard: 20 },
        ],
        total:14,
        place: 12,
        description:"",
    },
    { 
        pkID: 5,
        name: "Тухтаев-Литвинова",
        num:5,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:13, fkCard: 21 }, { numJudge:2, total:11, fkCard: 22 },
            { numJudge:3, total:13, fkCard: 23 }, { numJudge:4, total:10, fkCard: 24 },
            { numJudge:5, total:14, fkCard: 25 },
        ],
        total:14,
        place: 12,
        description:"",
    },
    { 
        pkID: 6,
        name: "Герасимов-Гольц",
        num:6,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:13, fkCard: 26 }, { numJudge:2, total:11, fkCard: 27 },
            { numJudge:3, total:13, fkCard: 28 }, { numJudge:4, total:10, fkCard: 29 },
            { numJudge:5, total:14, fkCard: 30 },
        ],
        total:14,
        place: 12,
        description:"",
    },
    { 
        pkID: 7,
        name: "Герасимов-Гольц",
        num:7,
        fkTask:1, 
        fkParty:1,
        cards:[
            { numJudge:1, total:13, fkCard: 31 }, { numJudge:2, total:11, fkCard: 32 },
            { numJudge:3, total:13, fkCard: 33 }, { numJudge:4, total:10, fkCard: 34 },
            { numJudge:5, total:14, fkCard: 35 },
        ],
        total:14,
        place: 12,
        description:"",
    },
]

/*
* Cуммарные результаты по заданию этапа по участникам
* 
* name - название участника, пары, группы
* fkTask - ссылка на задание
* fkParty - междусобойчик
* num - номер участника, пары, группы
* total - итоговый балл по задаче по всем судейским карточкам. Итоговый балл это не всегда сумма баллов по карточкам.
* place - место участника, определяется сортировкой по кол - ву баллов. Наибольший балл - 1 место.
* cards - список результатов по судейским карточкам
*     fkCard - ссылка на карточку, numJudge - номер судьи, total -  итоговый балл по корточке
*/
export class MockTotalsTask{
    static list(rec,hdl){
        const frmt = [ ['pkID','n'], ['name','s'], ['num', 'n'], ['fkTask','n'], 
                        ['fkParty','n'], ['cards','r',[ ['numJudge','n'],['total','n'],['fkCard', 'n'] ] ],
                        ['total', 'n'], ['place', 'n'], ['description','s'],
                        ] 
        
        let rs = makeRecordSet(frmt)
        R.forEach( rc => addRecord(rs,rc), totalsTask )
        hdl({r:rs, e:null})
    }
}



