const express = require("express");
const dotenv = require("dotenv")
const {connectDB} = require("./src/db")
const { graphqlHTTP } = require('express-graphql') //middleware that allows a connection
const schema = require('./src/graphql/schema')
const cookieParser = require('cookie-parser')
const { authenticate } = require('./src/middleware/auth')


dotenv.config()

const app = express();

// establishing language for the templating engine
app.set('view engine', 'ejs')
// Relative path to the views folder
app.set('views', './src/templates/views')

app.use(cookieParser())
// app.use(authenticate)

connectDB()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/login', (req, res) => {
//     res.render('login')
// })

app.get('/profile', (req, res) => {
    res.render('profile')
})

// app.get('/register', (req, res) => {
//     res.render('register')
// })

app.get('/user', (req, res) => {
    res.render('user')

})

require('./src/routes')(app)

app.listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${process.env.PORT}`);
  });