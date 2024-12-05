const express = require('express')
const router = require('./routers')
const multer = require('multer')
const session = require('express-session')
const app = express()
const port = 3000

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(session({
  secret: 'mySuperSecretKey12345!#%',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
  } 
}));

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})