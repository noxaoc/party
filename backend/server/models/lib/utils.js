/*
* Утилиты для моделей
*/

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
        hdl( new Error(`Поле '${name}' не может быть 'undefinded'!`))
        return false
    }
    if( rec[name]  === null ){
        hdl( new Error(`Поле '${name}' не может быть 'null'!`))
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

