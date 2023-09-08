/*
* Классы ошибок междусобойчика
*/

/* Ошибки окружения междусобойчика
*/
export class PartyErr extends  Error {
    constructor(message ) {
        super(message); 
    }
}

/*
* У поля с именем fldName недопустимо null - значение
*/
export class NotNullValueErr extends  PartyErr {
    constructor(fldName ) {
        super(`Поле '${fldName}' не может быть 'null'!`)
        this.fldName = fldName
    }
}

/*
* У поля с именем fldName недопустимо undefined - значение
*/
export class NotEmptyValueErr extends  PartyErr {
    constructor( fldName ) {
        super(`Поле '${fldName}' не может быть пустым!`)
        this.fldName = fldName
    }
}

/*
* У поля с именем fldName недопустимо undefined - значение
*/
export class NotUndefinedValueErr extends  PartyErr {
    constructor( fldName ) {
        super(`Поле '${fldName}' не может быть 'undefined'!`)
        this.fldName = fldName;
    }
}
