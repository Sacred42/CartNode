const express = require('express');
const passport = require('passport');
const router = express.Router();
const productsHema = require('../models/product');
const Cart = require('../config/cart')
const changeQty = require('../config/changeQty');



router.get('/' , async (req, res, next)=>{
    var products = await productsHema.find({}).lean();
    // let id = req.query.id;
    // let message = req.session.email;
    // console.log(message);
    res.render('mainPage' , { message : req.session.email , products : products});
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
      
})

router.get('/shopping-cart' , (req, res , next)=>{
    if(!req.session.cart){
      return  res.render('shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var products = cart.generateArr();
    res.render('shopping-cart' , {products : products , Totalprice : cart.Totalprice});
})

router.get('/signup' , (req,res,next)=>{
    // var message = req.session.email;
    var mesError = req.flash('error');
    res.render('auth/register' , {message : req.session.email , mesError : mesError});
});

router.get('/signin' , (req,res,next)=>{
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

module.exports = router;