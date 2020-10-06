var buttonPlus = document.querySelectorAll('.button_plus');
var quantityPlus = document.querySelector('.quantity_pm');
var costPlus = document.querySelector('.cost_pm');
var totacostlPlus = document.querySelector('.totalqty_pm');
var newQlvo = Number(quantityPlus.innerText);
var costPlusNew = Number(costPlus.innerText);
var totacostlPlusNew = Number(totacostlPlus.value);
buttonPlus.forEach((element)=>{
  element.addEventListener('click' , Plus_Product);
})
// buttonPlus.addEventListener('click' , Plus_Product);
function Plus_Product(){
  var getItem = this.parentNode;
  newQlvo++;
  costPlusNew += costPlusNew;
  totacostlPlusNew += totacostlPlusNew;
  costPlus.innerText = costPlusNew;
  totacostlPlus.value = totacostlPlusNew;
  quantityPlus.innerText = newQlvo;
  console.log(this.parentNode)
  

  
}