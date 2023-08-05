/*
 Отладочные данные по участникам мероприятия
*/

const R = require('ramda');

/* формат DD.MM.YY HH:MM:SS
  */
export const parseDateTimeStr=( datetimeStr )=>{
    // преобразуем строку в формат DD.MM.YYHH:MM:SS
    const dtStr = R.replace( ' ', '', R.trim(datetimeStr) )
    const day = parseInt(dtStr.slice(0,2))
    const month = parseInt(dtStr.slice(3,5)) - 1
    const year = parseInt(dtStr.slice(6,8)) + 2000
    const hour = parseInt(dtStr.slice(8,10))
    const minute = parseInt(dtStr.slice(11,13))
    const second = parseInt(dtStr.slice(14,16))
   return new Date(year, month, day, hour, minute, second )
  }
  
  export const dateTimeToStr=( dt )=>{
    // преобразуем дату в формат DD.MM.YY HH:MM:SS
    // никаких проверко на то что год < 2000 или 3000 не проверяется
   // console.log(dt)
    const day = dt.getDate()
    const month = dt.getMonth() + 1
    const year = dt.getFullYear() - 2000
    const hour = dt.getHours()
    const minute = dt.getMinutes()
    const second = dt.getSeconds()
    return `${day<10?0:''}${day}.${month<10?0:''}${month}.${year<10?0:''}${year} ${hour<10?0:''}${hour}:${minute<10?0:''}${minute}:${second<10?0:''}${second}`
  }
  

function initDate(year, month, day, hour, min, sec ){
    const dt = new Date( year, month-1, day, hour, min, sec )
    return dt.getTime()
}

let participants = [
    {
        "pid": 1,
        "gid": 1,
        "num": 1,
        "surname": "Пупкин",
        "patronymic": "Владленович",
        "name":"Валерий",
        "phone": "+7(980)678-90-99",
        "email": "pups@gmail.com",
        "regDate": new Date( 2023, 2, 1, 1, 45 ),
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 0,
        "comment": "вечно пьяный"
    },
    {
        "pid": 1,
        "gid": 2,
        "num": 1,
        "surname": "Пупкин2",
        "patronymic": "Владленович",
        "name":"Валерий",
        "phone": "+7(980)678-90-99",
        "email": "pups@gmail.com",
        "regDate": initDate(2023,2,1,1,2,45),
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 0,
        "comment":null
    },
    {
        "pid": 2,
        "gid": 1,
        "num": 2,
        "surname": "Хренова",
        "patronymic": "Михайловна",
        "name":"Александра",
        "phone": "+7(981)678-77-99",
        "email": "pups@gmail.com",
        "regDate": new Date(2023,2,1,2,2,45),
        "club":"TSK Triumf",
        "role": "follower",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "pid": 2,
        "gid": 2,
        "num": 2,
        "surname": "Хреновая",
        "patronymic": "Михайловна",
        "name":"Александра",
        "phone": "+7(981)678-77-99",
        "email": "pups@gmail.com",
        "regDate": new Date(2023,2,1,2,2,45),
        "club":"TSK Triumf",
        "role": "follower",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "pid": 3,
        "gid": 1,
        "num": 3,
        "surname": "Удивительный",
        "patronymic": "Стоянович",
        "name":"Марат",
        "phone": "+7(960)978-90-99",
        "email": "ups@gmail.com",
        "regDate": new Date(2023,2,2,1,2,45),
        "club":"Swingtown",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "pid": 4,
        "gid": 1,
        "num": 4,
        "surname": "Непомнящий",
        "patronymic": "Иванович",
        "name":"Михаил",
        "phone": "+7(960)978-93-99",
        "email": "pup1s@gmail.com",
        "regDate": new Date(2023,2,1,1,2,40),
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "pid": 5,
        "gid": 1,
        "num": 5,
        "surname": "Веселая",
        "patronymic": "Павловна",
        "name":"Вера",
        "phone": "+7(930)666-66-99",
        "email": "lil@gmail.com",
        "regDate": new Date(2023,2,11,1,2,56),
        "club":"TSK Triumf",
        "role": "ivara",
        "price": 5000,
        "paid": 5000,
        "comment":null
    },
    {
        "pid": 6,
        "gid": 1,
        "num": 6,
        "surname": "Удивительный",
        "patronymic": "Стоянович",
        "name":"Марат",
        "phone": "+7(960)978-90-99",
        "email": "pups@gmail.com",
        "regDate": new Date(2023,3,1,1,2,45),
        "club":"ivara",
        "role": "leader",
        "price": 5000,
        "paid": 2500,
        "comment":null
    },
    {
        "pid": 7,
        "gid": 1,
        "num": 7,
        "surname": "Смехова",
        "patronymic": "Алексеевна",
        "name":"Ольга",
        "phone": "+7(960)978-90-66",
        "email": "das@gmail.com",
        "regDate": new Date(2023,2,5,1,2,21),
        "club":"Tanzclass",
        "role": "follower",
        "price": 5000,
        "paid": 0,
        "comment":null
    },
    {
        "pid": 8,
        "gid": 1,
        "num": 8,
        "surname": "Мишин",
        "patronymic": "Петрович",
        "name":"Ринат",
        "phone": "+7(960)978-77-88",
        "email": "pus@gmail.com",
        "regDate": new Date(2023,2,5,1,2,45),
        "club":"Swingtown",
        "role": "leader",
        "price": 5000,
        "paid": 5000,
        "comment":null
    }
]

// минимальный стартовый pid участника междусобойчика
const startPID = () => 1
function initPid( gid ){
    return R.compose( R.reduce( R.max, startPID()), R.map((elem)=>elem.pid),
                     R.filter( R.whereEq({ gid: gid} ) ) ) (participants) + 1
}
// генератор следующего pid для междусобойчика формате хранения { <gid> : <следующий pid>, }
let nextPids = {}
function nextPID( gid ){
    let nextPid = nextPids[gid]
    if( R.isNil(nextPid) )
        nextPid = initPid(gid)
    nextPids[gid] = nextPid + 1
    return nextPid;
}

/* список свободных незанятых отсортированных в порядке возрастания номеров участников для каждого междусобойчика
   междусобойчики различаются gid - ом
   номера - положительные числа начинающиеся с 1
формат:
{
    <gid>: [список свободных номеров междусобойчика],
}
 элемент списка свободных номеров междусобойчика это следующий номер после максимального используемого участником
в междусобойчике
*/
// минимальный стартовый номер участника междусобойчика
const startNum = () => 1
function initNum( gid ){
    return R.compose( R.reduce( R.max, startNum()), R.map((elem)=>elem.num),
                     R.filter( R.whereEq({ gid: gid} ) ) ) (participants) + 1
}
// так как номера ограничены, их могут вообще печатать заранее, мы не можем ими разбрасываться
let gFreeNums = {}
// следующий максимальный номер после максимального уже используемого участником
function getFreeNum(gid){
    if( R.isNil(gid) )
        return null;
    let freeNums = gFreeNums[gid]
    if( R.isNil(freeNums) )
    {
        freeNums=[initNum(gid)]
        gFreeNums[gid]=freeNums
    }
    const freeNum = freeNums.shift()
    if( R.isEmpty(freeNums) )
        freeNums.push(freeNum + 1)
    console.log(`freeNum=${freeNum}`)
    return freeNum
}

// вернуть неиспользумый номер в список свободных номеров
function addUnusedNum( gid, num ){
    if( R.isNil(gid) || R.isNil(num) || num <= 0 )
        return
    let freeNums = gFreeNums[gid]
    if( R.isNil(freeNums) )
        gFreeNums[gid]=[num]
    else
        freeNums.unshift(num)
}

/***********  ограничения целостности на таблице participant ***********/
/* проверка уникальности номера
   вернет true если номер уникален, текущий pid записи естественно игнорируется
 */
/*
function checkUniqueNum( participant ){
    // отсутствие номера допустимо
    if( R.isNil(participant.num ) )
        return true
    //console.log( R.find( R.whereEq( { 'num': participant.num, 'gid':participant.gid } ), participants ) )
    return R.findIndex( R.both( R.whereEq( { 'num': participant.num, 'gid':participant.gid } ),  
                                R.complement( R.whereEq( {'pid': participant.pid} )) )
                         , participants ) < 0
}
*/
/* Проверка уникальности значение в поле c именем fldNum
    вернет true если значение  value поля с именем fldName уникально, текущий pid записи естественно игнорируется
*/
function checkUniqueFld( participant, fldName, value ){
    // отсутствие  значения считается уникальным
    if( R.isNil(value ) )
        return true
    const obj = {'gid': participant.gid }
    obj[fldName] = value
    //console.log( R.find( R.whereEq( { 'num': participant.num, 'gid':participant.gid } ), participants ) )
    return R.findIndex( R.both( R.whereEq( obj ),  
                                R.complement( R.whereEq( {'pid': participant.pid} )) )
                         , participants ) < 0
}

/* проверка отсутствия null значений
   если все ограничения целостности соблюдены вернет [], 
   иначе вернет [ constraintName, fldName ]
 */
function checkConstraints( rec, schema  ){
    const { headers } = schema
    const check_constraints = ( acc, {name, required, type, unique, enums } )=>{
        const value = rec[name]
        if( required && R.isNil(value) )
            return [ "required", name, type ]
        if( R.isNotNil(value) && typeof(value) !== type )
            return [ "type", name, type ]
        if( unique && !checkUniqueFld(rec, name, value ) )
            return [ "unique", name, type ]
        if( enums && !R.includes(value, enums) )
            return [ "enum", name, type ]

        return []
    }
    const nextFld = ( acc, obj ) => R.isEmpty(acc)
    
    return R.reduceWhile( nextFld, check_constraints, [], headers )
}

export class Participant{
    /*
    Прочитать информацию об участнике 
    Входные параметры:
    srv - системное имя сервиса, который выдает данные 
    gid (global event's identificator  -  идентификатор междусобойчика) участники и события имеют идентификаторы уникальные 
    только в пределах одного междусобойчика. Везде он передается как gid.
    pid (participant identificator ) - идентификатор участника междусобойчика
    Возвращает:
    объект вида
     {
        "gid":1,
        "pid": 1,
        "num": 1,
        "surname": "Пупкин",
        "patronymic": "Владленович",
        "name":"Валерий",
        "phone": "+7(980)678-90-99",
        "email": "pups@gmail.com",
        "regDate": "01.02.2023 01:02:45",
        "club":"TSK Triumf",
        "role": "leader",
        "price": 5000,
        "paid": 0
    }
     */
 
    /* 
        Получить список участников по роли.
        srv - системное имя сервиса который выдает данные
        role - роль участника, 
            "main" - основные обычные участники
            "organizer" - организатор
            "judge" -  судья
            "dj" - диджей
            "volunteer" - волонтер
            "photographer" - фотограф
            "host_of_event" -  ведущий  мероприятия
        filter - объект с необязательными свойствами
        {
            role: "роль участника",
            searchStr: "подстрока для поиска"
        }
        если задана подстрока для поиска, то просматриваются по ИЛИ свойства
        name, patronymic, surname, num, phone
    */
    static list( gid, filter ){
 
        const pred = (gid, str)=>{
            return R.both(  R.whereEq(   { 'gid': gid } ), 
                            R.anyPass([ (_)=>R.isNil(str) || R.isEmpty(str), // если строка поиска null или пустая, то дальше не смотрим
                                        ( item )=>R.includes( R.toLower(str), 
                                                  R.toLower(item.surname + ' ' + item.name + ' ' + item.patronymic ) ),
                                        R.whereAny(  {  'phone':R.includes(str),
                                                        'email':R.includes(str),
                                                        'num':R.equals(str)} ) ] )
                        );
        }
        //return participants;

        return R.filter( pred(gid, R.path(['searchStr'], filter) ), participants)
    }

    static listMain( gid, filter ){
        let tmp_filter = R.mergeDeepLeft( R.clone(filter), { role: "main" } ) 
        return this.list( gid, tmp_filter )
    }

    static remove( gid, pid ){
        const participant = this.read(gid,pid)
        if( R.isNotNil(participant) )
            addUnusedNum(gid,participant.num)
        participants = R.reject( R.whereEq( { 'gid': gid, 'pid': pid}), participants)
       // console.log(participants)
        //console.log(`gid=${gid} pid=${pid}`)
    }
    // прочитать участника
    static read( gid, pid ){
        return  R.find( R.whereEq( { 'gid': gid, 'pid': pid}), participants)
        //console.log(participants)
        //console.log(`gid=${gid} pid=${pid}`)


    }

    // создать пустого участника со всеми null полями
    static createNull(initData){
        let num = null;
        if( R.isNotNil(initData) 
            && R.isNotNil(initData.gid)
            && R.isNil(initData.num) )
            num = this.getFreeNum(initData.gid)

        let data = {
            "pid": null,
            "gid": null,
            "num": num,
            "surname": "",
            "patronymic": "",
            "name":"",
            "phone": "",
            "email": "",
            "regDate": new Date(),
            "club":"",
            "role": "",
            "price": 0,
            "paid": 0,
            "comment": ""
        }
        
        const copyValue = (value, key )=>{
            if( !R.includes( key, ['pid'] ) &&
                value !== undefined )
                data[key] = value
        }
        R.forEachObjIndexed( copyValue, initData ); 
        console.log(`create null rec ${data.num}`)
        return data;
    }

    static getSchema(){
        // required - true обязательное поле, not null. Если отсутствует null допустим
        // type - тип (number, string, boolean, bigint)
        return { headers: [
             {name:"pid", required: true, type: "number"},
             {name:"gid", required: true, type: "number"},
             {name:"num", required: false, type: "number", unique: true},
             {name:"surname", required: false, type: "string"},
             {name:"patronymic", required: false, type: "string"},
             {name:"name", required: false, type: "string"},
             {name:"phone",required: false,  type: "string"},
             {name:"email",required: false,  type: "string"},
             {name:"regDate", required: true, type:"object"},
             {name:"club",required: false,  type: "string"},
             {name:"role", type: "string", required: true, enums: ["leader", "follower"]},
             {name:"price", required: false, type: "number" },
             {name:"paid", required: false, type: "number"},
             {name:"comment",required: false,  type: "string"}
            ]
        }
    }

    /* Проверить ограничения для участников и вернуть результат анализа
       Если нет нарущений то вернет null, иначе текст ошибки
     */
    static checkConstraintsP( participant ){
        const result = checkConstraints( participant, this.getSchema() )
        if( R.isEmpty(result))
            return null
        const [constraintName, fldName, type ] = result
        if( R.equals( constraintName, "unique" ) ) {
            if( fldName === "num")
                return `Указанный номер "${participant[fldName]}" уже есть у другого участника!`
        } else if( R.equals(constraintName, "required") ){
            return `Поле с именем "${fldName}" не может быть пустым!`
        } else if( R.equals(constraintName, "type") ){
            return `Поле с именем "${fldName}" должно иметь тип "${type}"!`
        } else if( R.equals(constraintName, "enum") ){
            return `Поле с именем "${fldName}" имеет недопустимое значение "${participant[fldName]}"!`
        }
        return `Нарушено ограничение целостности "${constraintName}" в поле "${fldName}"`
    }

    // обновить данные по участнику, возвращает [gid,pid] или [null, error_text]
    static update( data ){
        if( R.isNil(data) || R.isNil(data.gid) )
            return [null, "идентификатор междусобойчика не может быть null"]
        if( R.isNil(data.pid) )
            return [null, "идентификатор участника не может быть null"]

        const idx = R.findIndex( R.whereEq( { 'gid': data.gid, 'pid': data.pid}), participants )
        if( idx < 0 )
            return [null,`Участника с указанным "${data.gid}" и "${data.pid}" не найдено!`]
        const resultCheck = this.checkConstraintsP(data, this.getSchema())
        if( R.isNotNil(resultCheck) )
            return [null, resultCheck]
        //if( !checkUniqueNum(data) )
        //    return [null,`Указанный номер "${data.num}" уже есть у другого участника!`]
        const old_data = participants[idx]
        const copyValue = (value, key )=>{
            if( !R.includes( key, [ 'gid', 'pid'] ) &&
                value !== undefined )
                old_data[key] = value
        }
        R.forEachObjIndexed( copyValue, data ); 

        return [data.gid,data.pid] 
    }

     // создать участника, возвращает [gid,pid] или [null,error_text]
     static create( data ){
        if( R.isNil(data) || R.isNil(data.gid) )
            return [null,"идентификатор междусобойчика не может быть null!"]
        //console.log(`init data ${data}`)
        let new_data = this.createNull(data)
        // генерируем новый pid и свободный номер
        new_data.pid = nextPID(data.gid)
        if( R.isNil(new_data.regDate) )
            new_data.regDate = new Date()
        //if( !checkUniqueNum(new_data) )
        //    return [null,`Указанный номер "${new_data.num}" уже есть у другого участника!`]
        const resultCheck = this.checkConstraintsP(new_data)
        if( R.isNotNil(resultCheck) )
            return [null, resultCheck]
        
        participants.push(new_data)
        //console.log(`create new rec ${new_data}`)
        return [new_data.pid,new_data.gid]
    }



    // получить свободные номер участника
    static getFreeNum(gid){
        return getFreeNum(gid)
        /*
        if( R.empty(participants) )
            return 1
        const getNum = ( participant ) => participant.num
        const diff = (a, b) =>  a - b
        // найти промежуток между номерами
        // возвращает true если между номерами нет промежутка
        const isNotEmptyNum = (acc, num) => num - acc <= 1;
        // возвратит номер после которого есть свободный номер
        const getPrevNum=( acc, elem )=> elem - acc > 1 ? acc : elem 
        const getFreeNumber = R.reduceWhile(isNotEmptyNum, getPrevNum, 0 ) 
        const freeNum = 1 + R.compose( getFreeNumber, R.sort(diff), R.filter(R.isNotNil), 
                                         R.map( getNum ), R.filter( R.propEq) )(participants) 
        return freeNum
        */
    }
    
    /* Список событий участника
    Формат:
    id - идентификатор выбранного учаcтником события
    eventID - идентификатор события,
    name - название события,
    price - стоимость для участника
    */
    static events( gid, pid  ){
        // получит список идентификаторов событий участника по его pid
        console.log(  pid )
        /* eventID - id события, price -  его стоимость для участника
        */
        const participantEvents = ParticipantEvent.list( pid )
        const ids = R.map(({eventID})=>eventID, participantEvents )
        const joinElem = ( event)=>{
            const pe = R.find( R.whereEq( {'eventID': event.id }) )( participantEvents )
            return { id: pe.id, eventID: pe.eventID, name: event.name, price: pe.price, role: pe.role }
        }
        return R.map( joinElem, Event.list( gid, { ids: ids} ) )
    }
}

/*
id - идентификатор цены
name - название цены
eventID - ссылка на событие
price - цена события
comment - описание цены
*/
class   Prices{
#prices = [
    { id: 1,
      eventID: 1, 
      name: "Базовая до 12.02.23",
      price: 20000,
      description: null },
    { id: 2,
      eventID: 1, 
      name: "Базовая после 12.02.23",
      price: 23000,
      description: null },
]
    
static getSchema(){
    return { headers: [
         {name:"id", required: true, unique: true, type: "number"},
         {name:"eventID", required: true, type: "number"},
         {name:"name", required: true, type: "string"},
         {name:"price",required: true,  type: "number"},
         {name:"comment",required: false,  type: "string"},
        ]
    }
}

}


let typeEvents = [
    {   id: 1,
        nameId: "competition", 
        name: "Соревнование",
        free: false,
        comment: "" },
    {   id: 2,
        nameId: "party", 
        name: "Вечеринка",
        free: false,
        comment: "" },
    {   id: 3,
        nameId: "masterClass", 
        name: "Мастер-класс",
        free: false,
        comment: "" },
    {   id: 4,
        nameId: "lesson", 
        name: "Лекция",
        free: false,
        comment: "" },
 ]

  

/* Типы событий 
Это встроенный системный справочник, заполняется разработчиками
name - название вида события, возможные варианты
* "Вечеринка"
* "Соревнование"
* "Урок"  
* "Лекция"
* "Мастер-класс"
* "Просмотр фильма"
free - true событие бесплатное, false платное
comment - описание вида события
*/
export class TypeEvent{
 
    static getSchema(){
        return { headers: [
             {name:"id", required: true, unique: true, type: "number"},
             {name:"nameId", required: true, unique: true, type: "string"}, 
             {name:"name", required: true, unique: true, type: "string"},
             {name:"free",required: true,  type: "boolean"},
             {name:"comment",required: false,  type: "string"},
            ]
        }
    }

    static list(){
        return typeEvents
    }

    static read ( id ){
        return R.find( R.whereEq( { id: id }), typeEvents )
    }
}

/*
Событие 
id - уникальный идентификатор события
gid - ссылка на междусобойчик
name - название события
typeEvent  - вид события
comment - описание события
startDate - дата начала события
*/
let events = [
    {
        gid: 1,
        id: 1, 
        typeEvent: 1 ,
        name: "Strictly Kids",
        description: "Темп 40-42 bpm",
        startDate: new Date(2023, 3, 25, 11, 0, 0 ),
    },
    {
        gid: 1,
        id: 2, 
        typeEvent: 1 ,
        name: "Mix&Match Kids",
        description: "",
        startDate: new Date(2023, 3, 25, 13, 0, 0 ),
    }
]

// минимальный стартовый pid участника междусобойчика
const startID = () => 1
function initID( gid ){
    return R.compose( R.reduce( R.max, startID()), R.map((elem)=>elem.pid),
                     R.filter( R.whereEq({ gid: gid} ) ) ) (events) + 1
}
// генератор следующего pid для междусобойчика формате хранения { <gid> : <следующий pid>, }
let nextIds = {}
function nextID( gid ){
    let nextid = nextIds[gid]
    if( R.isNil(nextid) )
        nextid = initID(gid)
    nextIds[gid] = nextid + 1
    return nextid;
}

export class Event{
/*
Cобытия  междусобойчика
*/

    static getSchema(){
        // required - true обязательное поле, not null. Если отсутствует null допустим
        // type - тип (number, string, boolean, bigint)
        return { headers: [
             {name:"id", required: true, unique:true, type: "number"},
             {name:"gid", required: true, type: "number"},
             {name:"name", required: false, type: "string"},
             {name:"typeEvent",required: true,  type: "number"},
             {name:"startDate", required: true, type: "object"},
             {name:"comment",required: false,  type: "string"},
            ]
        }
    }

    /*
       Список событий междусобойчика
       filter = {
          searchStr: <подстрока поиска по названию  события>
          ids: [<идентификаторы событий>]
       }
    */
    static list( gid, filter ){
        const ids = R.path( ['ids'], filter)
        const searchStr = R.path(['searchStr'], filter)
        if( R.isNotNil(ids) ){
            const joinById = ( event, id )=> { 
                return event.id === id && event.gid === gid 
                        && ( R.isNil(searchStr) 
                            || R.isEmpty(searchStr)  
                            ||  R.includes( R.toLower(searchStr),  R.toLower(event.name) ) )
            }
            return R.innerJoin( joinById, events, ids )

        }
        const pred = (gid, str)=>{
            if( R.isNil(str) || R.isEmpty(str) )
                return R.whereEq( { 'gid': gid } )
            return R.both(  R.whereEq( { 'gid': gid } ),
                           R.anyPass([ ( item )=>R.includes( R.toLower(str),  R.toLower(item.name) ) ] ) )
                    
        }

        return R.filter( pred(gid, searchStr ), events )
    }

    static listAll( gid, filter ){
        const joinTypeEvent = ( ev )=>{
            const te = TypeEvent.read( ev.typeEvent )
            return  { ...ev, typeEventName: te.name, dateStartStr: dateTimeToStr(ev.startDate) }
        }
        return R.map( joinTypeEvent,this.list(gid, filter ) )
    }

    static remove( gid, id ){
        events = R.reject( R.whereEq( { 'gid': gid, 'id': id}), events )
    }
    // прочитать  событие
    static read( gid, id ){
        return  R.find( R.whereEq( { 'gid': gid, 'id': id}), events)
    }

    // создать пустое событие со всеми null полями
    static createNull(initData){
        let data = {
            "id": null,
            "gid": null,
            "name":"",
            "startDate": new Date(),
            "typeEvent":null,
            "description": ""
        }
        
        const copyValue = (value, key )=>{
            if( !R.includes( key, ['id'] ) &&
                value !== undefined )
                data[key] = value
        }
        R.forEachObjIndexed( copyValue, initData ); 
        return data;
    }

    /* Проверить ограничения для участников и вернуть результат анализа
       Если нет нарущений то вернет null, иначе текст ошибки
     */
       static checkConstraintsE( event ){
        const result = checkConstraints( event, this.getSchema() )
        if( R.isEmpty(result))
            return null
        const [constraintName, fldName, type ] = result
        if( R.equals(constraintName, "required") ){
            return `Поле с именем "${fldName}" не может быть пустым!`
        } else if( R.equals(constraintName, "type") ){
            return `Поле с именем "${fldName}" должно иметь тип "${type}"!`
        } else if( R.equals(constraintName, "enum") ){
            return `Поле с именем "${fldName}" имеет недопустимое значение "${event[fldName]}"!`
        }
        return `Нарушено ограничение целостности "${constraintName}" в поле "${fldName}"`
    }


    // обновить данные по участнику, возвращает [gid,pid] или [null, error_text]
    static update( data ){
        console.log(data)
        if( R.isNil(data) || R.isNil(data.gid) )
            return [null, "Идентификатор междусобойчика не может быть null"]
        if( R.isNil(data.id) )
            return [null, "Идентификатор события не может быть null"]

        const idx = R.findIndex( R.whereEq( { 'gid': data.gid, 'id': data.id}), events )
        if( idx < 0 )
            return [null,`Cобытия с указанным gid="${data.gid}" и id="${data.id}" не найдено!`]
        const resultCheck = this.checkConstraintsE(data)
        if( R.isNotNil(resultCheck) )
            return [null, resultCheck]
        const old_data = events[idx]
        const copyValue = (value, key )=>{
            if( !R.includes( key, [ 'gid', 'id'] ) &&
                value !== undefined )
                old_data[key] = value
        }
        R.forEachObjIndexed( copyValue, data ); 

        return [data.gid,data.id] 
    }

    // создать участника, возвращает [gid,pid] или [null,error_text]
    static create( data ){
        if( R.isNil(data) || R.isNil(data.gid) )
            return [null,"идентификатор междусобойчика не может быть null!"]
        //console.log(`init data ${data}`)
        let new_data = this.createNull(data)
        // генерируем новый id и свободный номер
        new_data.id = nextID(data.gid)
        const resultCheck = this.checkConstraintsE(new_data)
        if( R.isNotNil(resultCheck) )
            return [null, resultCheck]
        
        events.push(new_data)
        //console.log(`create new rec ${new_data}`)
        return [new_data.id,new_data.gid]
    }





}

/*
C
*/
let pEvents=[
    {
        id: 1,
        pid: 1,
        eventID:1,
        price: 500,
        role:"leader",
    },
    {
        id: 2,
        pid: 1,
        eventID:2,
        price: 1000,
        role:"leader"
    },
    {   id: 3,
        pid: 2,
        eventID:1,
        price: 500,
        role:"follower"
    },
    {   id: 4,
        pid: 3,
        eventID:2,
        price: 1000,
        role:"follower"
    },

]
/*
Список событий в которых участник заинтересован
*/
export class ParticipantEvent{

static getSchema(){
    // required - true обязательное поле, not null. Если отсутствует null допустим
    // type - тип (number, string, boolean, bigint)
    return { headers: [
            {name:"id", required: true, type: "number"},
            {name:"pid", required: true, type: "number"},
            {name:"eventID", required: true, type: "number"},
            {name:"price",required:true, type: "number" },
            {name:"role",required:true, type: "string" }

        ]
    }
}

/*
Получить список событий выбранных участников
*/
static list( pid ){
 
    return R.filter( R.whereEq( { 'pid': pid } ), pEvents )

}

static remove( id ){
    if( R.isNil(id) )
        return null
    pEvents = R.reject( R.whereEq( { 'id': id }), pEvents )
}

}

//export default Participant

