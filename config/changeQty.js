function Change(qty){
    if(qty == 0){
        var message = 'The products nothing!';
        return message;
    }
        qty--;
        return qty;  
}

module.exports = Change;