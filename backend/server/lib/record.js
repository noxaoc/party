/*


EffectiveRecord  - объект предназначенный для передачи по сети
имеет формат массива из многих элементов
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
import {PartyDate} from "./partyday"
import * as R from 'ramda'
const RSET_FORMAT = 0 // формат RSET
const FLD_NAME = 0
const FLD_TYPE = 1

export function getFldName( frmt ){
    return frmt[FLD_NAME]
}

export function getFldType( frmt ){
    return frmt[FLD_TYPE]
}

export function makeRecordSet( frmt ){
    const checkFrmtFld = ( frmt_fld )=>{
        if( R.length(frmt_fld) < 2 )
            throw new SyntaxError('Неверно сконструированный формат RecordSet!')
        // проверить допустимый тип еще надо
        return false
    }
    R.find( checkFrmtFld, frmt )
    return  [ frmt ]
}

export function addRecord( rSet, db_rec ){
    const makeFld = ( fld_frmt )=>{
       const fld = db_rec[ fld_frmt[FLD_NAME] ] 
       return fld === undefined ? null : fld
    }
    const rec = R.map( makeFld, rSet[RSET_FORMAT] )
    rSet.push(rec)
}

export function emptyRSet( rSet ){
   return lengthRSet(rSet) === 0
}

export function lengthRSet( rSet ){
    const length = R.length(rSet) - 1
    return length < 0 ? 0 : length
 }
 
/*
Получит формат RecordSet
*/
export function getFrmtRSet( rSet ){
    return rSet[RSET_FORMAT]
}

/*

Сигнатура 
hdl = ( rec, frmt )=>...
*/
export function mapRSet( hdl, rSet ){
    if( R.isNil(rSet)   || emptyRSet(rSet) )
        return []
    let result = []
    const rSetFormat = getFrmtRSet(rSet)
    const localHdl = (rec, idx )=>{
        if( idx > 0 )
            result.push(hdl( rec, rSetFormat ))
    }
    rSet.forEach( localHdl )
    return result
}

/*
* Сделать из записи формата RecordSet js - объект вида { name:value }
*/
export function     makePlainObj( rec, frmt, chgValue = true ){
    const fldHdl = ( fldValue, fldName, fldType )=>{
        switch( fldType ){
            case "t":
                return PartyDate.fromTS(fldValue)
            case "d":
                return PartyDate.dateFromTS(fldValue)
            default:
                return fldValue
        }
    }
   return makeJSObj( rec, frmt, fldHdl )
   
}


/*
* Сделать из записи формата RecordSet js - объект {name:value}
* если valueHdl не задан значения остаются как есть
* valueHdl = ( fldValue, fldName, fldType )=>return newFldValue
*/
export function  makeJSObj( rec, frmt, valueHdl ){
    let pobj = {}
    const fldHdl = ( ffrmt, idx )=>pobj[getFldName(ffrmt)] = valueHdl ?
                                                             valueHdl(rec[idx], getFldName(ffrmt), getFldType(ffrmt)):
                                                             rec[idx]
    frmt.forEach( fldHdl  )
    return pobj
}

/*
* Сделать из по индексу запись из RecordSet и сделать из нее js - объект {name:value}
* если valueHdl не задан значения остаются как есть
* valueHdl = ( fldValue, fldName, fldType )=>return newFldValue
*/
export function  makeJSObjByIdx( rSet, idx, valueHdl ){
    return makeJSObj( rSet[idx + 1], getFrmtRSet(rSet), valueHdl)
}

export function makePlainObjByIdx( rSet, idx = 0 ){
    return makePlainObj( rSet[idx + 1], getFrmtRSet(rSet))

}

/*
* Изменить null - значения на пустые 
*/
export function changeNullValueToEmptyStr( rec ){
    const chgNullValue = value =>  R.isNil(value) ? "" : value
    return R.mapObjIndexed(chgNullValue, rec)
}

/*
Преобразовать RecordSet в список js - объектов
*/
export function makeListPlainObj( rSet ){
    return mapRSet( makePlainObj, rSet )
}

/*
* Получить запись, состоящую из преобразованных полей записи rec к формату frmt  
* если поля из rec не соответствовали типам из frmt
*/
export function getChgFldsRec( frmt, rec ){
    const chgFlds = {}
    const createChgFlds = fld => {
        const name = fld[0]
        const type = fld[1]
        switch( type ){
            case 't':{
                const value = rec[name]
                if( value !== undefined && typeof(value) === 'string' )
                    chgFlds[name] = PartyDate.toTS(value)
                break
            } 
            case 'd':{
                const value = rec[name]
                if( value !== undefined && typeof(value) === 'string' )
                    chgFlds[name] = PartyDate.dateToTS(value)
                break
            } 
            default:{
                break
            }
        } 
    }
    R.forEach( createChgFlds, frmt )
    return chgFlds
}
