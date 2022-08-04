'use strict'
const User = require("../models/user").User
const SessionStorage = require('../models/session_storage').SessionStorage
const crypto = require('crypto');

 
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// зарегистрировать нового пользователя
exports.doUserRegister = (req, res) => {
//console.log( req.body )
    const { email, firstName, secondName, familyName, password, confirmPassword } = req.body;
    // Проверьте, совпадают ли пароль
    if (password === confirmPassword) {
        // Проверьте, зарегистрирован ли пользователь с тем же адресом электронной почты
        const user = new User()
        if ( user.id_by_email(email) ) {
            res.render('registration', {
                message: 'Пользователь с email:${email} уже существует. Пожалуйста, укажите другой email.',
                messageClass: 'alert-danger'
            });
            return;
        }
        const hashedPassword = getHashedPassword(password);
        // Сохранить пользователя в базе данных, если вы его используете
        user.create({
            firstName,
            secondName,
            familyName,
            email,
            password: hashedPassword
        }, null)
        res.render('login', {
            message: 'Регистрация успешно завершена. Пожалуйста, выполните вход для продолжения работы.',
            messageClass: 'alert-success'
        });
    } else {
        res.render('registration', {
            message: 'Пароль или логин введен неправильно.',
            messageClass: 'alert-danger'
        });
    }
//console.log( "push user ok")
}

/*
*   Выполнить логин по email и паролю
*   Реализация:
*   По email ищется пользователь, сверяется его пароль с переданным, 
*   если пароли совпадают, конструируется сессия( sid ) в Хранилище сессий
*   и эта сессия проставляется в Cookie в параметр "sid_token" 
*   если была старая сессия в Cookie, то она удаляется из Хранилища сессий
*/
exports.doUserLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = new User()
    const userId = user.checkPassword( email, hashedPassword)
    if (  userId !== undefined ) {

        const s_storage = new SessionStorage() 
        const sid = s_storage.create( { used_id: userId } )
        
        // удаляем старую  сессиию
        const old_sid = req.signedCookies.sid_token
        s_storage.remove( old_sid )
       
        //  устанавливаем новую сессию
        res.cookie('sid_token', sid, {signed: true, httpOnly: true });

        // Перенаправить пользователя на защищенную страницу в нашем случае на корень домена
        // хотя должны перенаправлять на изначальную защищенную страницу с которой шел запрос
        res.redirect('/');
    } else {
        res.render('login', {
            message: 'Неверное имя пользователя или пароль!',
            messageClass: 'alert-danger'
        });
    }
}

exports.home = (req, res) => { 
    // если нет сессии, идем на страницу аутентификации
  /*
    const sid = req.signedCookies.sid_token
    const s_storage = new SessionStorage() 
    // если сессия невалидна, идем на страницу аутентификации
    if( s_storage.check(sid) === false ){
        res.redirect('/login')
        return
    }
*/
    res.render('home')
}
exports.sectionTest = (req, res) => res.render('section-test')

exports.register = (req, res) => res.render('registration')
//exports.doUserRegister = doUserRegister

exports.login = (req, res) => res.render('login')

//exports.doUserLogin = doUserLogin 

exports.notFound = (req, res) => res.render('404')

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */
