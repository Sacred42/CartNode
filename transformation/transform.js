module.exports =  function Transform(){
   this.ToString = function(obj){
       var ToStr = String(obj);
       return ToStr;
   };
   function ToNumber(obj){
       var ToNum = Number(obj);
       return ToNum;
   }
}