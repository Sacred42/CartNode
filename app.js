const mongoose = require('mongoose');
const express = require('express');
const expresshbs = require('express-handlebars');
const router = require('./routes/router');
const payrouter = require('./routes/payrouter');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const paypal = require('paypal-rest-sdk');
const path = require('path');

const app = express();
app.engine('.hbs', expresshbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
require('./config/config');


app.listen(3000, ()=>{
    console.log('Сервер запущен!');
});

try{
    mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false' , { useNewUrlParser : true, useFindAndModify : false , useUnifiedTopology: true});
   
}
catch(e){
  console.log(e);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret : 'secret',
  resave : false,
  saveUninitialized: false,
  store : new MongoStore({mongooseConnection : mongoose.connection}),
  cookie : {
    maxAge : 1000 * 300 // минимум 30 сек, иначе выдает ошибку
  }
}));


paypal.configure({ // создание уонфигурации с параметрами!
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AfNhyrGTHbpUCTDFIv9DMGG9JNKHpqvuzc9y7GLCnKtUdJvNZoFPDM7Oh574yg1l6AEROX267JLdTi_l',
  'client_secret': 'EP07ctLVqIaSpEck7sidgI8PPviADgq0YPuEy64oWadzkXZ6TUUuXMLf5F0lCbLmd8jc1udNTCccWv63'
});

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.log = req.isAuthenticated(); // хранится информация об авторизации (true , false)!
  res.locals.session = req.session; // информация об сессии!
  next();
})
app.use(flash());
app.use(router);
app.use(payrouter);
app.use(express.static(path.join(__dirname, 'public')));

