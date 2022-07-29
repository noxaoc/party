/*
Хранилище сессий
Термины:
Идентификатор сессии ( sessionID или sid) - уникальный токен выдаваемый пользоваетелю на время после упешной аутентификации
Данные сессии ( sessionData ) - данные пользователя связанные с сессией, как минимум это userID
Валидная сессия - сессия из хранилища срок действия которой не истек 
*/

const memoDB = require("./memodb")
const crypto = require('crypto')



class  MemSessionStorage {
    _storage = {}
    // записать сессию в хранилище с данными, если такая уже есть вернуть false, не записывая, иначе вернуть true
    set( sid, userData ){
        if ( this.check(sid) )
            return false
        this._storage[sid] = userData
        return true
    }

    // удалить сессию пользователя
    remove ( sid ){
        delete this._storage[sid]
    }

    // вернуть true если сессия валидна, иначе false
    check( sid ){
        return sid in this._storage
    }

    /* получить данные пользователя ассоцированные с сессией
       Если сессия не валидна, вернуть undefined
    */
    getData( sid ){
        return this._storage[sid]
    }

    // удалить все сессии в хранилище
    flush(){
        delete this._storage;
        this._storage = {}
    }
}

class  SessionStorage {

    static _modelDb = undefined  

    static _getDriver(){
         if( !SessionStorage._modelDb ){
             if( memoDB.memoDB() === true ){
                SessionStorage._modelDb = new MemSessionStorage()
             }else{
                SessionStorage._modelDb = new RedisSessionStorage() 
             }
         }
         return SessionStorage._modelDb
     }

    // получить новый идентификатор сессии для пользователя, и записать ассоциированные с ним данные в хранилище
    // гарантируется, что одна и таже  сессия для разных пользователей не будет сгенерирована
    get( userData ){
        // TODO: соблюди гарантию! Она еще не соблюдена
        let sid = undefined
        for( let count = 0; count < 10; ++count){
            sid = crypto.randomBytes(30).toString('hex')    
            if( SessionStorage._getDriver().set(sid,userData) )
                return sid
        }
        return undefined
    }

    // удалить сессию пользователя
    remove ( sid ){
        SessionStorage._getDriver().remove(sid)
    }

    // вернуть true если сессия валидна, иначе false
    check( sid ){
        return SessionStorage._getDriver().check(sid)
    }

    /* получить данные пользователя ассоцированные с сессией
       Если сессия не валидна, вернуть undefined
    */
    getData( sid ){
        return SessionStorage._getDriver().getData(sid)
    }

    // удалить все сессии в хранилище
    flush(){
        SessionStorage._getDriver().flush()
    }
}

/* Тест */
const sidStorage = new SessionStorage()
const sid1 = sidStorage.get( { userID: 1}) 
console.log( "Новая сессия без дублирования: " +  Boolean(sid1 !== undefined)  )
console.log( "Сессия в хранилище присутствует: " + Boolean( sidStorage.check(sid1) === true)  )
console.log( "Данные в хранилище по сессии есть: " + Boolean( sidStorage.getData(sid1) !== undefined ) )
if ( sidStorage.getData(sid1) !== undefined )
    console.log( "Данные в хранилище по сессии верные: " + Boolean( sidStorage.getData(sid1).userID === 1 ) )
else 
    console.log( "Данные в хранилище по сессии верные: " + false )
sidStorage.remove( sid1 )
console.log( "Сессия в хранилище удалена: " +Boolean( sidStorage.check(sid1) === false ) )
const sid2 = sidStorage.get( { userID: 2}) 
const sid3 = sidStorage.get( { userID: 3}) 
sidStorage.flush()
console.log( "Все хранилище очищено: " + Boolean( sidStorage.check(sid2) === false && sidStorage.check(sid3) === false ) )



