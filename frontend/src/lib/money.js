/*
 Маленькие утилиты для работы с деньгами в междусобойчике
*/


export class  PartyMoney{

/*
Если value = 0 возвращает "", чтобы не возвращать 0 там где в этом нет необходимости
*/
static getEmpty( value ){
    return value === 0 ? "" : value
}


}