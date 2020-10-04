const { request } = require('express');
const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const getAr = require('../config/arrforoRDER');
const order = require('../models/storeProducts');
const trans = require('../transformation/transform');
var Transform = new trans();


router.post('/pay', (req, res) => {
    
    const create_payment_json = { // JSON ФАЙЛ С ПАРАМЕТРАМИ ОБ ПЛАТЕЖЕ КОТОРЫЙ НЕОБХОДИМ ДЛЯ ОББРАБОТКИ ФУНКЦИИ paypal.payment.create
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": req.body.totalqty,
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": req.body.totalqty
          },
          "description": "Hat for the best team ever"
      }]
  };
  
  req.session.total = req.body.totalqty;
  paypal.payment.create(create_payment_json, function (error, payment) { // payment ответ успешной обработки данных 
    if (error) {
        throw error;
    } else {
        console.log(payment);
        for(let i = 0;i < payment.links.length;i++){ // ищем ссылку на осуществление транзакции
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
});

router.get('/success' , async (req, res)=>{
    const payerId = req.query.PayerID; // id плательщика
    const paymentId = req.query.paymentId; // id платежа
    const totalqty = req.session.total;
    var dateCreate = new Date();  
    console.log(req.user);
     
    var orders = await order.find({});
    console.log(orders);
    // console.log(req.user._id);
    console.log(totalqty);
   

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": totalqty
            }
        }]
      };
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            var informPay = {
                price: totalqty,
                datePay : Transform.ToString(dateCreate)
                
            }     
           order.findOne({'user' : req.user._id}, function(err, result){
               if(err){
                   return err;
               }
               console.log("айди" + req.user._id);
               console.log("ресулт" + result);
               if(result == null){
                   
                var newOrder = new order({
                    user: req.user,
                    price: [],
                    
                    });
                    newOrder.price.push(informPay);
                    newOrder.save((err)=>{
                        if (err){
                            return err
                        }
        
                    })
            }
                
            
            
           // console.log(orederPrice)
        else{
            console.log(result.price)
            // console.log(typeof req.user._id)
            result.price.push(informPay);
            //var orederPrice = orders[0].user;
            // console.log(typeof orederPrice);
            // StrorederPrice = String(orederPrice);
            // console.log(typeof StrorederPrice); // преобразование в строку 

            order.findOneAndUpdate({user : Transform.ToString(req.user._id)} ,  {price : result.price} ,function(err){
                if (err){
                    return err;
                }
            })
        }
           })
                    // информация об объекте
            
            
           
           
            res.send('Success');
        }
    });
});

function isLogin(req, res, next){
    if(req.isAuthenticated()){
       return next()
    }
       res.redirect('/');
   }
   
   function isnotLogin(req, res, next){
       if(!req.isAuthenticated()){
           return next()
        }
           
           res.redirect('/');
   }

module.exports = router;