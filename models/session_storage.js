/*
Хранилище сессий
Термины:
Идентификатор сессии ( session_id или sid) - уникальный токен выдаваемый пользоваетелю на время после упешной аутентификации
Данные сессии ( session_data ) - данные пользователя связанные с сессией, формат:
{ uid: <ид пользователя> }
Валидная сессия - сессия из хранилища срок действия которой не истек 
*/

const memoDB = require("./g_cfg_params")
const crypto = require('crypto')
const g_cfg_params = require("./g_cfg_params")



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
    get_data( sid ){
        return this._storage[sid]
    }

    // удалить все сессии в хранилище
    flush(){
        delete this._storage;
        this._storage = {}
    }
}

/* Хранилище сессий с каждой сессией связан объект формата:
{ 
    user_data: <user_data>, 
    created: <дата и время создания сессии>  
}
*/
class  SessionStorage {
    // длина генерации сессии в БАЙТАХ т.е. сессия в строке в виде hex будет в полубайтах, в два  длинее
    static _SID_LENGHT_BYTES = 30
    // длина сессии в виде строки
    static SID_LENGHT = 2 * SessionStorage._SID_LENGHT_BYTES
    static _model_db = undefined  

    static _get_driver(){
         if( !SessionStorage._model_db ){
             if( g_cfg_params.in_memory() === true ){
                SessionStorage._model_db = new MemSessionStorage()
             }else{
                SessionStorage._model_db = new RedisSessionStorage() 
             }
         }
         return SessionStorage._model_db
     }

    // получить новый идентификатор сессии для пользователя, и записать ассоциированные с ним данные в хранилище
    // гарантируется, что одна и таже  сессия для разных пользователей не будет сгенерирована
    create( user_data ){
        // TODO: соблюди гарантию! Она еще не соблюдена
        let sid = undefined
        for( let count = 0; count < 10; ++count){
            sid = crypto.randomBytes(SessionStorage._SID_LENGHT_BYTES).toString('hex')    
            if( SessionStorage._get_driver().set(sid, { "user_data": user_data, created: Date.now() } ) )
                return sid
        }
        return undefined
    }

    // удалить сессию пользователя
    remove ( sid ){
        SessionStorage._get_driver().remove(sid)
    }

    // вернуть true если сессия валидна, иначе false
    check( sid ){
        return SessionStorage._get_driver().check(sid)
    }

    /* получить данные пользователя ассоцированные с сессией sid - session_data
       Если сессия не валидна, вернуть undefined
    */
    get_data( sid ){
        const data = SessionStorage._get_driver().get_data(sid)
        if( data === undefined ) 
            return undefined
        const created = new Date( data.created )
        const tmp_dt = new Date( 1000 * g_cfg_params.sid_life_time() )
        if( (created +  tmp_dt )  <= Date.now()  ){ // cессия уже истекла
            SessionStorage._get_driver().remove(sid) 
            return undefined
        }
        return data.user_data
    }

    // удалить все сессии в хранилище
    flush(){
        SessionStorage._get_driver().flush()
    }
}

exports.SessionStorage = SessionStorage



