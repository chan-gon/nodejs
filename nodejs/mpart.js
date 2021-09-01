
var m = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

module.exports = m; //mpart.js 기능 중에서 m이 가리키는 객체를 모듈 바깥에서 사용할 수 있도록 설정
