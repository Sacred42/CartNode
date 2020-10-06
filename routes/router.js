const express = require('express');
const passport = require('passport');
const router = express.Router();
const productsHema = require('../models/product');
const Cart = require('../config/cart');
const order = require('../models/storeProducts');
const changeQty = require('../config/changeQty');
const trans = require('../transformation/transform');
const { request } = require('express');




router.get('/' , async (req, res, next)=>{
    var products = await productsHema.find({}).lean();
    var messageNotAuth = req.flash('error');
    res.render('mainPage' , { message : req.session.email , messageNotAuth: messageNotAuth,  products : products});
});

router.get('/addToCart/:id/:qty/:title' , (req, res, next)=>{
    var Productid = req.params.id;
    var ProductQty = req.params.qty;
    var nome = req.params.title;
    var nothing = 0;
    var isChanged = changeQty(ProductQty);
    
    if(isChanged >= 0){
        productsHema.findByIdAndUpdate (Productid , {title : nome , qty : isChanged} , function(err, product){
            if (err){
                return err;
            }
          
           
            var cart = new Cart(req.session.cart ? req.session.cart : {} );
            cart.add(product, Productid);
            req.session.cart = cart;
            console.log(req.session.cart)
            res.redirect('/');
         
        })
        
    }
   
    // var errors = [] ;
    // if(errors.length > 2){
    //    return res.redirect('/' , {errors : errors});
    // }
      
});

router.get('/store-order' , isLogin , async (req, res)=>{
    var orders = await order.findOne({'user' : req.session.passport.user } , function(err, result){
        if(err){
            err
        }
    });
    console.log(orders);
    //console.log(typeof req.session.passport.user);
     var priceArr = orders.price;
    
     res.render('StoreOrder', {priceArr : priceArr, message : req.session.email})
})

router.get('/shopping-cart' , isLogin, (req, res , next)=>{
    if(!req.session.cart){
      return  res.render('shopping-cart', {message : req.session.email});
    }

     
    var cart = new Cart(req.session.cart);
    var products = cart.generateArr();
    res.render('shopping-cart' , {products : products , message : req.session.email,  Totalprice : cart.Totalprice});
})

router.get('/signup' , (req,res,next)=>{
    // var message = req.session.email;
    var mesError = req.flash('error');
    res.render('auth/register' , {message : req.session.email , mesError : mesError});
});

router.get('/signin' , isnotLogin, (req,res,next)=>{
    var errMesage = req.flash('error');
    
    res.render('auth/getIn' , {errMesage : errMesage});
});

router.get('/logout' , (req, res , next)=>{
    req.session.destroy();
    res.redirect('/');
})

router.post('/signup' , passport.authenticate('local.register',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.post('/signin' , passport.authenticate('local.signin' , {
   // successRedirect: '/profile',
    failureRedirect : '/signin',
    failureFlash : true
}), function(req, res, next){
    var message = req.body.email;
    req.session.email = message;
    
    res.redirect('/')

    // let id = new Date().getTime();
    // req.session[id] = message;
    // res.redirect(`/?id=${id}`);
});

function isLogin(req, res, next){
 if(req.isAuthenticated()){
    return next()
 }
    req.flash('error', 'You need auth' );
    res.redirect('/');
}

function isnotLogin(req, res, next){
    if(!req.isAuthenticated()){
        return next()
     }
        res.redirect('/');
}

module.exports = router;