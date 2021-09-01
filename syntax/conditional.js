var args = process.argv;
console.log(args[2]);
console.log('A');
console.log('B');

// === 로 비교 시 비교 값 및 타입이 일치해야 한다
// == 로 비교 시 값만 일치하면 된다
if(args[2] === '1'){
  console.log('C1');
}
else{
  console.log('C2');
}
console.log('D');
