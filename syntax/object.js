var members = ['charlie', 'joe', 'jimmy'];

var roles = {name: 'charlie', job: 'dev', age: 31}
console.log(roles.job);
for(var name in roles){
  console.log(roles[name]);
}
