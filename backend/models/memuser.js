// пользователь в памяти, id - идентификатор пользователя
class MemUser{
    // генератор ключа
    _id = 1
    // список пользователей, ключ id:данные
    _users = {}
    // индекс по email, значением является email:id
    _emailIndex = {}

    create( data, cb ) {
        // проверить нет ли дублирования по email
        if( !data.email )throw new Error( "У пользователя обязательно должен быть задан email!")
        if ( this.id_by_email(data.email) ) throw new Error( "Пользователь с email:" + data.email + " уже существует!")
        let id = this._id
        this._id++
        this._users[id] = data 
        this._emailIndex[data.email] = id
        return id
    }

    // прочитать пользователя по id
    read ( id, cb ){
        return this._users[id]
    }

    // удалить пользователя по id
    delete ( id, cb ) {
        let data = this.read(id)
        if( data ){
            delete this._users[id]
            delete this._emailIndex[data.email]
        }
        
    }

    // возвращает id пользователя по eго email
    id_by_email( email ) {
        // проверить нет ли дублирования по email
        // pre_cond: email == true 
        return this._emailIndex[email]
    }

    // удалить всех пользователей
    delete_all(){
        this._users = {}
        this._emailIndex = {}
    }

}

module.exports = { MemUser: MemUser }