/*
* Утилиты для моделей
*/

import { isEmpty } from "ramda"
import { NotUndefinedValueErr, NotEmptyValueErr, NotNullValueErr } from "./errors"

/**
 * Проверить, что свойство с именем name являющееся массивом или строкой  или объектом не пустое
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство имеет пустое значение, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkIsEmptyFld = ( rec, name, hdl ) =>{
    if( isEmpty( rec[name] )){
        hdl( new NotEmptyValueErr(name) )
        return false
    }
    return true
}

/**
 * Проверить, что свойство с именем name в rec не null и не undefined
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkIsNilFld = ( rec, name, hdl ) =>{
    if( rec[name]  === undefined ){
        hdl( new NotUndefinedValueErr(name) )
        return false
    }
    if( rec[name]  === null ){
        hdl( new NotNullValueErr(name) )
        return false
    }
    return true
}

/**
 * Проверить, что fkParty в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если fkParty null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkFkParty = ( rec, hdl ) => checkIsNilFld( rec, 'fkParty', hdl )
/**
 * Проверить, что pkID в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если pkID null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkPkID = ( rec, hdl ) => checkIsNilFld( rec, 'pkID', hdl )
/**
 * Проверить, что pkID и fkID в rec не null и не undefined
 * @param { запись } rec 
 * @param { обработчик } hdl 
 * @returns false если pkID или fkID null или undefined, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkRec = ( rec, hdl ) => checkPkID( rec, hdl ) && checkFkParty( rec, hdl )

/**
 * Проверить, что свойство с именем ids являющееся массивом не пустое и не null
 * @param { запись } rec 
 * @param { имя свойства } name 
 * @param { обработчик } hdl 
 * @returns false если свойство имеет пустое значение, а в обработчик ставится объект ошибки с текстом. 
 * true если все нормально. 
 */
export const checkIds = ( rec, hdl ) => checkIsNilFld( rec, 'ids', hdl ) && checkIsEmptyFld( rec, 'ids', hdl ) 


