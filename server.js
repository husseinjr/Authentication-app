const express = require('express');
const router_auth = require('./routes/authRoutes');
const session = require('express-session');
const flash = require('express-flash');
const app = express()

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs");
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash())

const port = process.env.PORT || 3000;

 
app.get('/session', (req, res) => {
    res.send(req.session.user)
}) 

app.get('/', (req, res) => {
    res.render('index')
})

app.use('/users' , router_auth )




app.listen(port,() => console.log(`the server listen on port ${port}`))