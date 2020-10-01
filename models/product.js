const mongoose = require('mongoose');
const schema = mongoose.Schema;

var product = new schema({
    image : {type : String, required : true},
    title :{type : String, required : true},
    cost :{type : Number, required : true},
    qty : {type : Number, required : true}

});

module.exports = mongoose.model('MycartProduct', product);