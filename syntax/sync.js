var fs = require('fs');

console.log('readFileSync');
console.log('A');
var fileSync = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(fileSync);
console.log('C');

console.log('readFile');
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, data){
  console.log(data);
});
console.log('C');
