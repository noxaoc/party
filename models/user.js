
const memoDB = require("./memodb")
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

// пользователь в памяти id - идентификатор пользователя
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

}
/* Тест 
let dbUser = new MemUser();
let usr_id = dbUser.create({email:"ups@gmail.com", firstName:"Василий", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log(usr_id);
usr_id = dbUser.create({email:"ups1@gmail.com", firstName:"Алексей", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log(usr_id);
usr_id = dbUser.create({email:"ups3@gmail.com", firstName:"Алексей", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log( dbUser.read(1, null) )
dbUser.delete(1)
console.log( dbUser.id_by_email("ups3@gmail.com") )
console.log( dbUser.id_by_email("ups@gmail.com") )
*/

// модель пользователя
class User {
   static _modelDb = undefined  

   static _getDriver(){
        if( !User._modelDb ){
            if( memoDB.memoDB() === true ){
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

}

module.exports = { User: User }

/* Тест User
let dbUser = new User();
let usr_id = dbUser.create({email:"ups@gmail.com", firstName:"Василий", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log(usr_id);
usr_id = dbUser.create({email:"ups1@gmail.com", firstName:"Алексей", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log(usr_id);
usr_id = dbUser.create({email:"ups3@gmail.com", firstName:"Алексей", secondName: "Петрович", familyName: "Пупкин"}, null );
console.log( dbUser.read(1, null) )
dbUser.delete(1)
console.log( dbUser.id_by_email("ups3@gmail.com") )
console.log( dbUser.id_by_email("ups@gmail.com") )
console.log( dbUser.id_by_email("") )
*/
