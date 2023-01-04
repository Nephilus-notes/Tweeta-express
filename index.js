const express = require("express");
const dotenv = require("dotenv")
const {connectDB} = require("./src/db")
const { graphqlHTTP } = require('express-graphql') //middleware that allows a connection
const schema = require('./src/graphql/schema')

dotenv.config()

const app = express();

connectDB()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

// establishing language for the templating engine
app.set('view engine', 'ejs')
// Relative path to the views folder
app.set('views', './templates/views')

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/user', (req, res) => {
    res.render('user')

})


app.listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${process.env.PORT}`);
  });