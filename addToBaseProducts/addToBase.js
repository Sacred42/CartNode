const product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false' , { useNewUrlParser : true, useFindAndModify : false , useUnifiedTopology: true});

var products = [
    new product({
        image : 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-gold-select-2019_GEO_EMEA?wid=834&hei=1000&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1567808542418',
        title : 'Iphone11',
        cost : 450,
        qty : 6

    }),
    new product({
        image : 'https://img.mvideo.ru/Pdb/30026135b.jpg',
        title : 'Iphone7',
        cost : 170,
        qty : 5

    }),
    new product({
        image : 'https://apple-pro.ru/upload/medialibrary/99e/iphone_3gs.jpg',
        title : 'Iphone3',
        cost : 65,
        qty : 3

    })
];

var done = 0;
for(var i=0 ; i < products.length; i++){
    products[i].save(function(err, result){
        if (err){
            return err
        }
        done++;
        if (done === products.length) {
            exit();
        }
    })
}

function exit() {
    mongoose.disconnect();
}

