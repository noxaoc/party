const express = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')

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

//app.use(weatherMiddlware) 

app.get('/', handlers.home)
app.get('/section-test', handlers.sectionTest)

app.get('/register', handlers.register )
app.post('/register', handlers.doUserRegister )

app.get('/login', handlers.login )
app.post('/login', handlers.doUserLogin )


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
