/*


EffectiveRecord  - объект предназначенный для передачи по сети
имеет формат массива из многих элментов
0 - элемент это всегда массив форматов полей, чьи значения переданы в последкющих элементах
>0 - элементы массивов значений полей, чьи форматы описаны  в элементе 0
индекс формата поля и индекс значения совпадают в массивах их элементов
[
   [ [<fld_name>, <value_type>, <типозависимые значения>],  ],
   [ <value>, ],
]

где 
fld_name - имя поля
value - значение поля
value_type - тип поля
допустимые типы полей:
n - целое число
r -  вещественное число
s - строка
t -  timestamp
d - дата
tm - время

Format -  объект описывающий формат полей
формат нам необходим для интерпретации так как json не содержит всех необходимых типов
Record - объект
*/

import * as R from 'ramda'
const FLD_NAME = 0
const FLD_TYPE = 1
export function makeRecordSet( frmt ){
    const checkFrmtFld = ( frmt_fld )=>{
        if( R.length(frmt_fld) < 2 )
            throw "Неверно сконструированный формат!"
        // проверить допустимый тип еще надо
        return false
    }
    R.find( checkFrmtFld, frmt )
    return  [ frmt ]
}

export function addRecord( record_set, db_rec ){
    const makeFld = ( fld_frmt )=>{
       const fld = db_rec[ fld_frmt[FLD_NAME] ] 
       return fld == undefined ? null : fld
    }
    const rec = R.map( makeFld, record_set[0] )
    record_set.push(rec)
}
