const mongoose = require('mongoose');
const schema = mongoose.Schema;

var user = new schema({
    email : {type : String , required : true},
    password : {type : String , required : true},
});

module.exports = mongoose.model('Mycartuser' , user);