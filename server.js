var path = require('path')

var express = require('express')
var bodyParser = require('body-parser')
var hbs = require('express-handlebars')

var routes = require('./routes')

var app = express()

module.exports = app

// Middleware

app.use(bodyParser.urlencoded({extended: true}))
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Routes

app.get('/', routes.getHome)
app.get('/view/:id', routes.getView)
app.get('/assignments', routes.getAssignments)
app.post('/add', routes.postAdd)
app.post('/change/:id', routes.postChange)
app.post('/delete/:id', routes.postDelete)
app.post('/rubbish/:id', routes.postRubbish)

app.knex = routes.knex
