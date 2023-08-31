/*
 Маленькие утилиты для работы с датой и временем в специфике Междусобойчика
 Это дата и время в форматах:
 
 "DD.MM.YY HH:mm:ss"
 "DD.MM.YY HH:mm" 
 "DD.MM.YY"
*/
import dayjs from 'dayjs' 
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const datetimeFormat = "DD.MM.YY HH:mm:ss"
const dateFormat = "DD.MM.YY"

export class  PartyDate{

/*
Получить timestamp – количество секунд, прошедших с 1 января 1970 года UTC+0.
из строки в формате datetimeFormat
*/
static toTS( ts_str ){
    return dayjs( ts_str, datetimeFormat ).unix()
}

/*
Получить из timestamp строку в формате datetimeFormat
*/
static fromTS( ts ){
    return dayjs.unix( ts ).format(datetimeFormat)
}

/*
Получить timestamp – количество секунд, прошедших с 1 января 1970 года UTC+0.
из строки в формате dateFormat
*/
static dateToTS( ts_str ){
    return dayjs( ts_str, dateFormat ).unix()
}

/*
Получить из timestamp строку в формате dateFormat
*/
static dateFromTS( ts ){
    return dayjs.unix( ts ).format(dateFormat)
}


}