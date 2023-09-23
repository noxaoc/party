/*
* тестовые данные
*/

import e from "cors"
import { PartyDate } from "../../lib/partyday" 
import * as R from "ramda"

// Участники междусобойчика
let participants = [
    {
        "fkParty": 1,
        "num": 1,
        "surname": "Пупкин",
        "patronymic": "Владленович",
        "name":"Валерий",
        "phone": "+7(980)678-90-99",
        "email": "pups@gmail.com",
        "dtReg": PartyDate.toTS( "01.02.23 01:45" ),
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 0,
        "comment": "вечно пьяный"
    },
    {
        "fkParty": 2,
        "num": 1,
        "surname": "Пупкин",
        "patronymic": "Владленович",
        "name":"Вениамин",
        "phone": "+7(980)678-90-99",
        "email": "pups@gmail.com",
        "dtReg": PartyDate.toTS( "01.02.23 02:45" ), 
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 0,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 2,
        "surname": "Хренова",
        "patronymic": "Михайловна",
        "name":"Александра",
        "phone": "+7(981)678-77-99",
        "email": "pups@gmail.com",
        "dtReg": PartyDate.toTS( "02.02.23 03:20" ),
        "club":"TSK Triumf",
        "role": "follower",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "fkParty": 2,
        "num": 2,
        "surname": "Хреновая",
        "patronymic": "Михайловна",
        "name":"Александрина",
        "phone": "+7(981)678-77-99",
        "email": "pups@gmail.com",
        "dtReg": PartyDate.toTS( "01.02.23 01:23" ), 
        "club":"TSK Triumf",
        "role": "follower",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 3,
        "surname": "Удивительный",
        "patronymic": "Стоянович",
        "name":"Марат",
        "phone": "+7(960)978-90-99",
        "email": "ups@gmail.com",
        "dtReg": PartyDate.toTS( "03.02.23 05:05" ),
        "club":"Swingtown",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 4,
        "surname": "Непомнящий",
        "patronymic": "Иванович",
        "name":"Михаил",
        "phone": "+7(960)978-93-99",
        "email": "pup1s@gmail.com",
        "dtReg": PartyDate.toTS( "01.02.23 01:34" ),
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 5,
        "surname": "Веселая",
        "patronymic": "Павловна",
        "name":"Вера",
        "phone": "+7(930)666-66-99",
        "email": "lil@gmail.com",
        "dtReg": PartyDate.toTS( "01.02.23 06:05" ),
        "club":"TSK Triumf",
        "role": "ivara",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 6,
        "surname": "Удивительный",
        "patronymic": "Стоянович",
        "name":"Марат",
        "phone": "+7(960)978-90-99",
        "email": "pups@gmail.com",
        "dtReg": PartyDate.toTS( "04.02.23 01:33" ),
        "club":"ivara",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 7,
        "surname": "Смехова",
        "patronymic": "Алексеевна",
        "name":"Ольга",
        "phone": "+7(960)978-90-66",
        "email": "das@gmail.com",
        "dtReg": PartyDate.toTS( "03.02.23 21:51" ),
        "club":"Tanzclass",
        "role": "follower",
        "price": 5000,
        "paid": 0,
        "comment":null
    },
    {
        "fkParty": 1,
        "num": 8,
        "surname": "Мишин",
        "patronymic": "Петрович",
        "name":"Ринат",
        "phone": "+7(960)978-77-88",
        "email": "pus@gmail.com",
        "dtReg": PartyDate.toTS( "03.02.23 00:12" ),
        "club":"Swingtown",
        "role": "leader",
        "price": 5000,
        "paid": 5000,
        "comment":null
    }
]


/*
* События в которых заинтересован участник
*/
const participantEvents=[
    {
        partyName: 'Swingtown Little Cup 2023',
        eventName:'Mix&Match Kids',
        name: 'Валерий',
        price: 500,
        role:'',
    },
    {
        partyName: 'Swingtown Little Cup 2023',
        name: 'Валерий',
        eventName:'Strictly Kids',
        price: 1000,
        role:''
    },
    {   partyName: 'Swingtown Little Cup 2023',
        name: 'Александра',
        eventName:'Mix&Match Kids',
        price: 500,
        role:''
    },
    {   partyName: 'Swingtown Little Cup 2023',
        name: 'Александра',
        eventName:'Strictly Kids',
        price: 1000,
        role:''
    },
]


export function getParticipants(){
    return participants
}

export function getParticipantEvents(){
    return participantEvents
}

/**
 * Получит максимальный номер участника 
 */
export  function getMaxNum(){
    const maxNum = ( acc, elem ) => R.max(acc,elem.num)
    return R.reduce(maxNum, 0, getParticipants())

}

export  function countParticipants( fkParty ){
    const cnt = ( acc, elem ) =>  elem.fkParty === fkParty ? acc + 1 : acc
    return R.reduce(cnt, 0, getParticipants())

}
