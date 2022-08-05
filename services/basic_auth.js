/*
* Стратегия аутентификации по логину и паролю.
* 
*/
'use strict'
const PassportLocalStrategy = require('passport-local').Strategy,
      User = require("../models/user").User,
      crypto = require('crypto'),
      g_cfg_params = require('../g_cfg_params')
 
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// если база пользователей пуста, то создаем первого пользователя с логином "party-admin" и паролем "1"
function  InitUserDB() {
    if( g_cfg_params.in_memory() !== true )
        return
    const user = new User()
    const id = user.id_by_email("party@party.com")
    const hashed_password = getHashedPassword("1");
    if( user.id_by_email("party@party.com") === undefined )
        user.create( {  email: "party@party.com", 
                        firstName: "party@party.com", 
                        secondName: "party@party.com", 
                        familyName: "party@party.com", 
                        password: hashed_password  }, null )
}
InitUserDB() 


exports.create = () => { 
    return new PassportLocalStrategy ( 
        { // поля с формы логина
            usernameField: 'email',
            passwordField: 'password',
        },
        (user, password, done) => { // собственно функция аутентификации
            const user_storage = new User()
            const hashed_password = getHashedPassword(password);
            const user_id = user_storage.check_password( user, hashed_password)
            if (  user_id === undefined )
                return done( null, false, {
                    message: 'Неверное имя пользователя или пароль!',
                })
        
            // аутентификация пройдена
            return done(null, { uid: user_id } )
        })
}