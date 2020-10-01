module.exports = function Cart(oldSession){
 this.items = oldSession.items || {};
 this.Totalprice = oldSession.Totalprice || 0;
 this.Totalqty = oldSession.Totalqty || 0;

  this.add = function(product, productId){
     storedProduct = this.items[productId];
     if(!storedProduct){
        storedProduct =  this.items[productId] = {product : product.title , quantity : 0, cost : 0 };
     }
     storedProduct.quantity++;
     storedProduct.cost = storedProduct.quantity * product.cost;
     this.Totalqty++;
     this.Totalprice = this.Totalprice + product.cost;

 }
 
 this.generateArr = function(){
   var arr = [];
   for (var id in this.items) { // цикл для объекта!
       arr.push(this.items[id]);
   }
   return arr;
 }
}