
const g_cfg_params = require("./g_cfg_params")
const MemUser = require("./memuser").MemUser
/* Структура данных для описания пользователя
{ 
    id,         // ид  пользователя
    email, 
    firstName,  // имя
    secondName, // отчество
    familyName, // фамилия
    password,   // пароль
} 
*/


// модель пользователя
class User {
   static _modelDb = undefined  

   static _getDriver(){
        if( !User._modelDb ){
            if( g_cfg_params.in_memory() === true ){
                User._modelDb = new MemUser()
            }else{
                User._modelDb = new PostgreSQLUser() 
            }
        }
        return User._modelDb
    }

    static all(cb) {
    //db.all('SELECT * FROM a r t i c l e s ', cb);
    }

    // вернуть данные пользователя по id
     read (id , cb) {
        return User._getDriver().read(id, cb)
    }

    // создать пользователя. вернуть его id
    create ( data, cb ) {
        return User._getDriver().create( data, cb )
    }

    // удалить пользователя по id
    delete (id , cb) {
        User._getDriver().delete( id, cb )
    }

    // удалить пользователя по id
    id_by_email (id ) {
        return User._getDriver().id_by_email(id)
    }

    // проверить логин и пароль, вернуть id пользователя если все в порядке, иначе undefined
    checkPassword( email, password ){
        if( !email )
            return undefined
        let drv = User._getDriver()
        let id = drv.id_by_email(email)
        if( id === undefined )
            return undefined
        let user = drv.read(id,null)
        if( user !== undefined && user.password === password )
            return id
        return undefined
    }

    // удалить всех! пользователей
    delete_all(){
        User._getDriver().delete_all()
    }


}

module.exports = { User: User }


