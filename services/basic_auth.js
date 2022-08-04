/*
* Стратегия аутентификации по логину и паролю.
* 
*/
'use strict'
const PassportLocalStrategy = require('passport-local').Strategy,
      User = require("../models/user").User,
      crypto = require('crypto')
 
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

exports.create = () => { 
    return new PassportLocalStrategy ( 
        { // поля с формы логина
            usernameField: 'email',
            passwordField: 'password',
        },
        (user, password, done) => { // собственно функция аутентификации
            const user_storage = new User()
            const hashed_password = getHashedPassword(password);
            const user_id = user_storage.checkPassword( user, hashed_password)
            if (  user_id === undefined )
                return done( null, false, {
                    message: 'Неверное имя пользователя или пароль!',
                })
        
            // аутентификация пройдена
            return done(null, { uid: user_id } )
        })
}