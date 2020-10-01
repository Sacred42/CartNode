const { serializeUser, deserializeUser } = require('passport');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const uzer = require('../models/user');

passport.serializeUser(function (user, done) { 
    done(null, user.id);
    console.log('serializeUser');
});

passport.deserializeUser(function (id, done) { 
    uzer.findById(id, function (err, user) {
        done(err, user);
        console.log('deserializeUser');
    });
});
//В типичном веб-приложении, учетные данные, используемые для аутентификации пользователя будет передаваться только во время авторизации. Если все в порядке, и пользователь существует, то информация о нем сохраняется в сессию, а идентификатор сессии, в свою очередь, сохраняется в cookies браузера.

//Каждый последующй запрос будет содержать cookies, с помощью которого passport сможет опознать пользователя, и достать его данные из сессии. Для того, чтобы сохранять или доставать пользовательские данные из сессии, паспорт использует функции `passport.serializeUser()` и `passport.deserializeUser()`.


passport.use('local.register' ,new Strategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    // назначение имен полей для распознования
} , function(req, email, password , done){
    
    uzer.findOne({'email' : email}, function(err, user){
        if(err){
            return done (err, false);
        }
        if(user){
          return done(null , false, req.flash('error' , 'Email is already!'));
        }
        if(password.length < 5 ){
            return done(null, false, req.flash('error','Short password' ));
        }
        
        var newUser = new uzer({
            email : email,
            password : password
        });
        // var newUser = new uzer();
        // newUser.email = email;
        // newUser.password = password;
        newUser.save(function(err, user){
            if(err){
                return done(err, false);
            }
            return done(null, newUser)
        });
    })
}));

passport.use('local.signin', new Strategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    
}, function(req, email, password, done){
    uzer.findOne({'email' : email}, function(err, user){
        if (err){
            return done (err , false );
        }
        if(!user){
            return done (null, false , req.flash('error', 'User not found!'));
        }
        if(user.password != password){
            return done (null, false, req.flash('error', 'Password is wrong!'));
        }
        return done (null, user, req.flash('success', email));
    })
}))
