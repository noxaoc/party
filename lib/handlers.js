const User = require("../models/user").User

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
        user = new User()
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




// Тут будут хранится пользователи и authToken, связанных с ними
const authTokens = {};

exports.doUserLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = new User()
    const userId = user.checkPassword( email, hashedPassword)
    if (  userId !== undefined ) {
        const authToken = generateAuthToken();

        // Сохранить токен аутентификации
        authTokens[authToken] = userId;

        // Установка токена авторизации в куки
        res.cookie('AuthToken', authToken);

        // Перенаправить пользователя на защищенную страницу
        res.redirect('/admin');
    } else {
        res.render('login', {
            message: 'Неверное имя пользователя или пароль!',
            messageClass: 'alert-danger'
        });
    }
}

exports.home = (req, res) => res.render('home')
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
