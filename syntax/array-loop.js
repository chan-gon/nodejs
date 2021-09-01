var number = [1,400,12,34,5];

var sum = 0;
for(var num of number){
  console.log(num);
  sum += num;
}
console.log("sum = " + sum);

console.log("-------------");

var i = 0;
var total = 0;
while(i < number.length){
  console.log(number[i]);
  total = total + number[i];
  i = i + 1;
}
console.log("total = " + total);
