const express = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')
//const weatherMiddlware = require('./lib/middleware/weather')

const app = express()

// configure Handlebars view engine
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
})
app.engine('handlebars', hbs.engine )
app.set('view engine', 'handlebars')

const port = process.env.PORT || 3000
// папка расположения статических файлов
app.use(express.static(__dirname + '/public'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const cookieParser = require('cookie-parser')
const { credentials } = require('./g_cfg_params')
app.use( cookieParser( credentials.cookieSecret) )

const session = require('express-session')

app.use( 
  session( {
    resave: false,
    saveUninitialized: false ,
    secret: credentials.cookieSecret,
  })
)

const passport = require('passport')
const localStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// если сессия невалидная  то редирект на страницу логина
/*
function check_auth() {
  return app.use((req, res, next) => {
    if(req.user 
      || req.route === '/register'
      || req.url === '/favicon.ico' ) 
      next()
    else 
      res.redirect('/login')
  })
}
*/

const check_auth = (req, res, next) => {
  if(req.user 
    || req.route === '/register'
    || req.url === '/favicon.ico' ) 
    next()
  else 
    res.redirect('/login')
}

app.use(passport.initialize())
app.use(passport.session())

const basic_auth_strategy = require('./services/basic_auth')

passport.use( basic_auth_strategy.create() )

app.get('/section-test', handlers.sectionTest)

app.get('/register', handlers.register )
app.post('/register', handlers.doUserRegister )

app.get('/login', handlers.login )
//app.post('/login', handlers.doUserLogin )

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',            // после удачной аутентфикации идем на корень, хотя
    failureRedirect: '/login',       // неудачная аутентификация отправляет на логин
    failureFlash: true,
  })
)

app.get('/', check_auth, handlers.home)

// 404 ошибка
app.use(handlers.notFound)
// 500 ошибка
app.use(handlers.serverError)

if(require.main === module) {
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })
} else {
  module.exports = app
}
