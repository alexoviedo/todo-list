
// =============== require node modules ====================
const express = require('express')
handlebars = require('express-handlebars')
bodyParser = require('body-parser')
morgan = require('morgan')
session = require('express-session')
expressValidator = require('express-validator')

// ============== sets templates======================
expressApp = express()
expressApp.engine('handlebars', handlebars())
expressApp.set('views', './views')
expressApp.set('view engine', 'handlebars')


expressApp.use(express.static('public'))


expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({
  extended: false
}))

// ===================== setup cookies =================
expressApp.use(expressValidator())
expressApp.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'this could be anything'
}))

expressApp.use(morgan('dev'))


expressApp.use((a, b, c) => {
  c()
  thisSession = a.session
  thisSession.doneList || (thisSession.doneList = [])
  thisSession.toDoList || (thisSession.toDoList = [])
})


// ========= post task to doc and redirect to root ========
expressApp.post('/taskPost', (a, b) => {

  let c = a.body.toDo;
  a.validationErrors() ?
    b.render('home', {}) :
    (a.session.toDoList.push(c),
      b.redirect('/'))
})

// ======== delete selected item from list and redirect to root ======
expressApp.get('/delete/:index', (a, b) => {
  let c = a.session.toDoList.splice(a.params.index, 1)
  a.session.doneList.push(c)
  b.redirect('/')
})

expressApp.get('/', (a, b) => {
  b.render('home', {
    toDo: a.session.toDoList,
    completeTask: a.session.doneList
  })
})

expressApp.listen(3e3)
