const mongoose = require('mongoose');
const schema = mongoose.Schema;

var order = new schema({
    //name : {required: true, type : String},
    // productID : {required: true, type : String},
    user: {type: schema.Types.ObjectId, ref: 'Mycartuser'},
    price : {required: true, type : Array},
    date : {required: false, type: String},
    // isCreated : {required : true, type}
    
});

module.exports = mongoose.model('MycartOrders', order);