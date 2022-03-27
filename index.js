const express = require("express")
const ejs = require("ejs")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'signin-sigout', resave: false, saveUninitialized: false
})) 

app.get('/', (request, response) => {
    if (request.session.login) {
        let login = request.session.login;
        response.render('signin', {login, isValid: true, password: request.cookies.password || '', save: request.cookies.save || '', signedIn: true})
    } else {
        console.log('request.cookies', request.cookies)
        let login = request.cookies.login || ''
        let password = request.cookies.password || ''
        let saveCookie = request.cookies.save || ''
        let signedIn = false
        response.render('signin', {
            login: login,
            password: password,
            save: saveCookie,
            signedIn,
            isValid: false
        })
    }
    
})

app.all('/signin', (req, res) => {
    let login = req.cookies.login || ''
    let password = req.cookies.password || ''
    let saveCookie = req.cookies.save || ''
    let signedIn = false
    let valid = false

    console.log('session', req.session.login)
    // check session login 
    if (req.session.login) {
        res.render('signin', {login: req.session.login, isValid: true, password, save: saveCookie, signedIn: true})
    } else {
        login = req.body.login || ''
        password = req.body.password || ''
        saveCookie = req.body.save || ''
        // ใส้ข้อมูลเข้ามา
        if(login === "node" && password === "bird") {  
            // เลือก save ไว้ในเครื่อง
            if (req.body.save) {
                let age = 10000
                res.cookie('login', login, {maxAge: age})
                res.cookie('password', password, {maxAge: age})
                res.cookie('save', saveCookie, {maxAge: age})
            } else {
                res.clearCookie('login')
                res.clearCookie('password')
                res.clearCookie('save')
            }


            req.session.login = login
            console.log('Add session', req.session)
            signedIn = true
            valid = true
        } else {
            password = ''
        }
        res.render('signin', {
            login: login,
            password: password,
            save: saveCookie,
            signedIn: signedIn,
            valid: valid
        })
    }
})

app.get('/signout', (req,res) => {
    if (req.session.login) {
        req.session.destroy((err) => { })
    }
    res.redirect('/signin')
})

app.listen(3000, () => console.log('Server Start'))