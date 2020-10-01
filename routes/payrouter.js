const { request } = require('express');
const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');


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

router.get('/success' , (req, res)=>{
    const payerId = req.query.PayerID; // id плательщика
    const paymentId = req.query.paymentId; // id платежа
    const totalqty = req.session.total;
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
            res.send('Success');
        }
    });
});



module.exports = router;